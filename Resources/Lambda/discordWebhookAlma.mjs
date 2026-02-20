import fetch from 'node-fetch';
import formData from 'form-data';
import {
    PutObjectCommand,
    S3Client,
    S3ServiceException,
} from "@aws-sdk/client-s3";
import http from 'https';
import fs from 'fs';
import promise from 'promise';
import cheerio from 'cheerio';
import moment from 'moment-timezone';

const webhookUrls = ["https://discord.com/api/webhooks/", "https://discord.com/api/webhooks/", "https://discord.com/api/webhooks/", "https://discord.com/api/webhooks/"];

export const handler = (event, context, callback) => {
    console.log("Event : " + JSON.stringify(event));
    console.log("Context : " + JSON.stringify(context));

    var options = {
        host: 'www.krosmoz.com',
        port: 443,
        path: '/en/almanax',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
        }
    };

    console.log("Getting alma webpage with options : ", options);

    http.get(options, function (res) {
        var almaSiteBody = "";
        console.log("get alma webpage http code : ", res.statusCode);
        res.on('data', function (data) {
            almaSiteBody += data;
        });
        res.on("end", function () {
            // console.log("Body : ", almaSiteBody);
            getDataFrom(almaSiteBody)
                .then(result => {
                    console.log("Data from alma : " + JSON.stringify(result));

                    var imageUrl = result.image.split(".com");

                    var options = {
                        host: `${imageUrl[0].split("https://")[1]}.com`,
                        port: 443,
                        path: imageUrl[1],
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
                        }
                    };

                    console.log("Getting image with options : ", options);

                    http.get(options, function (res) {
                        var imageData = "";
                        console.log("get image http code : ", res.statusCode);
                        res.on('data', function (data) {
                            imageData += data;
                        });
                        res.on("end", function () {
                            // console.log("Got image", imageData);
                            // result.image = imageData;

                            // const s3client = new S3Client({region: "ca-central-1"});

                            //   const putCommand = new PutObjectCommand({
                            //     Bucket: 'rubybot',
                            //     Key: 'tempAlmaImages/almaImage1.png',
                            //     Body: imageData
                            //     // Body: await readFile(filePath),
                            //   });
                            // //   try {
                            //     s3client.send(putCommand)
                            //         .then(response => {
                            //             console.log("response from s3 : ", response);
                            //         })
                            //         .catch(err => {
                            //             console.log("err from s3 : ", err);
                            //         })

                            //   } catch (err) {
                            //         if (err instanceof S3ServiceException) {
                            //         console.error(
                            //             `Error from S3 while uploading object to ${bucketName}.  ${err.name}: ${err.message}`,
                            //         );
                            //         } else {
                            //         throw err;
                            //     }
                            // }
                            // result.image = imageData;
                            fs.writeFile('/tmp/almaImg.png', Buffer.from(imageData, 'base64'), function (err) {
                                if (err) throw err
                                console.log('Image saved.')

                                var counter = 0;
                                webhookUrls.forEach(function (url) {
                                    counter += 1;
                                    sendDataToWebhook(result, url)
                                        .then(response => {
                                            console.log("Data sent successfully. Returned response : ", response);
                                            if (counter == webhookUrls.length) {
                                                return;
                                            }
                                        })
                                        .catch(err => {
                                            console.log("Error in sendDataToWebhook : ", err);
                                            return err;
                                        });
                                });
                            });
                        })
                    }).on('error', function (err) {
                        console.log("Error in http get : ", err);
                        return err;
                    });
                })
                .catch(err => {
                    console.log("Error in getDataFrom : ", err);
                    return err;
                });
        });
    }).on('error', function (err) {
        console.log("Error in http get : ", err);
        return err;
    });
};


function getDataFrom(almSiteBody) {
    return new Promise(function (resolve) {
        let $ = cheerio.load(almSiteBody, {
            decodeEntities: false
        });

        let data = {
            image: "",
            offering: "",
            bonus: ""
        };

        let offering = $(".more-infos-content").toString();
        offering = offering.split('<p class="fleft">')[1];
        offering = offering.split('</p>')[0];
        offering = offering.trim();
        data.offering = offering;

        let bonus = $(".mid").toString();
        bonus = bonus.split('<div class="more">')[1];
        bonus = bonus.split('<div')[0];
        bonus = bonus.split("<b>").join("");
        bonus = bonus.split("</b>").join("");
        bonus = bonus.trim();
        data.bonus = bonus;

        let image = $(".more-infos-content").toString();
        image = image.split('<img src="')[1];
        image = image.split('">')[0];
        image = image.trim();
        data.image = image;

        resolve(data);
    });
}

function sendDataToWebhook(data, webhookUrl) {
    return new Promise(function (resolve, reject) {
        var embedData = {
            "embeds": [{
                "author": {
                    "name": "Almanax for " + moment().tz("Europe/Paris").format('MMMM Do'),
                    "url": "http://www.krosmoz.com/en/almanax"
                },
                "color": 16697031,
                "fields": [{
                    "name": ":calendar_spiral: Offering:",
                    "value": data.offering
                },
                {
                    "name": ":money_mouth: Bonus:",
                    "value": data.bonus
                }
                ],
                "thumbnail": {
                    "url": "attachment://tmp/almaImage.png"
                    // "url":"https://static.ankama.com/dofus/www/game/items/200/56429.w75h75.png"
                    // "url": data.image
                }
            }]
        };

        console.log("Embed data : " + JSON.stringify(embedData));

        fs.readFile('/tmp/almaImg.png', { encoding: 'base64' }, function (err, image) {
            if (err)
                console.log(err);
            else {
                const form = new formData();
                // form.append('file1', new Blob([data.image], {type:"application/octet-stream"}));
                // form.append('file1', fs.createReadStream('./tmp/almaImg.png')); // give absolute path if possible       
                // form.append('file1', fs.createReadStream('./tmp/almaImg.png')); // give absolute path if possible       
                form.append('file1', image, 'almaImage.png');
                form.append('payload_json', JSON.stringify(embedData))
                var headers = form.getHeaders();

                // console.log("headers : ", headers);

                fetch(webhookUrl, {
                    method: 'post',
                    // body: JSON.stringify(embedData),
                    // headers: headers
                    headers: form.getHeaders(),
                    body: form
                    // headers: { 'Content-Type': 'application/json' }
                })
                    .then(data => {
                        console.log('Request succeeded with JSON response', data);
                    })
                    .catch(error => {
                        console.log('Request failed', error);
                    });
            }
        })
    });
}

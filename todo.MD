view latest guild related events
    const root : HTMLElement | TextNode  = parse(html);
        if(root instanceof HTMLElement){
            const actus =  root.querySelectorAll('.ak-actions-list .ak-title');
            let string = '';
            actus.forEach((element : HTMLElement) => {
                string += this.strip(element.toString()).trim() + '\n';
            });
            return string;
        }

view command should include more info (date joined server?)
add total level for professions
scoreboard for total levels

move to own account, integrate with a pipeline from github to auto restart
    - this would be a good way to reset user data, and add some sort of confirmation that the info is still valid (send a monthly notice?)

add an option to create a poll (not sure if this is needed)
    - if yes, restrict it to admins only
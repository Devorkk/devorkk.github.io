window.onload = function () {

    const formatNumber = num => Number(num).toLocaleString().replaceAll(',', ' ').replaceAll('.', ' ')

    let submit = document.querySelector('button:nth-child(5)');
    let input = document.querySelector('input');
    let serverSpan = document.querySelector('span');

    for (let i = 0; i < 3; i++) {
        let dropdown = document.getElementsByClassName('dropdown-item')[i]
        dropdown.addEventListener('click', () => serverSpan.textContent = dropdown.text)
    }

    function getData(body) {
        const firstIndex = body.indexOf('options.bootstrap = {') + 20;
        const lastIndex = body.indexOf('};', firstIndex) + 1;
        const text = body.substring(firstIndex, lastIndex)
        return JSON.parse(text)
    }

    function getRank(body) {
        const firstIndex = body.indexOf('icon-crown')
        const lastIndex = body.indexOf('xp progression-item', firstIndex)
        const text = body.substring(firstIndex, lastIndex);
        return text.replace(/\D/g, '')
    }

    function getAvatars(body) {
        const firstIndex = body.lastIndexOf('creation-stats')
        const lastIndex = body.lastIndexOf('Avatar Marketplace', firstIndex)
        const text = body.substring(firstIndex, lastIndex);
        return text.replace(/\D/g, '') ? text.replace(/\D/g, '') : 0
    }

    function getDate(body) {
        let date = new Date(body.created)
        let days = date.toDateString()
        let time = date.toUTCString().slice(17, 25)
        return `${days}, ${time}`
    }

    function getServer(server) {
        const serverPath = {
            'Live': 'www.kogama.com',
            'Brazil': 'kogama.com.br',
            'Friends': 'friends.kogama.com'
        }
        return serverPath[server]
    }

    input.addEventListener('keypress', function (e) {
        if (e.repeat) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            submit.click();
        }
    });

    submit.addEventListener('click', () => {
        document.querySelector('section').scrollIntoView()
        document.querySelector('span:nth-child(1)').className = "spinner-border spinner-border-sm"
        submit.disabled = true

        fetch(`https://api.allorigins.win/get?url=https://${getServer(serverSpan.textContent)}/profile/${input.value}/`)
            .then(async html => await html.text())
            .then((data) => {
                document.getElementById('alert-error').style.display = 'none'
                document.querySelector('span:nth-child(1)').className = ''
                submit.disabled = false

                let parsed_data = JSON.parse(data).contents
                let user = getData(parsed_data).object;
                let rank = getRank(parsed_data)
                let time = getDate(user)
                let images = user.images.large.indexOf('cache') == -1 || user.images.large.indexOf('avatar') != -1 ? user.images.large.replace('//', 'https://') : user.images.large.replace('//', 'https://').replace('cache', 'images').replace('_330x451.jpg', '.png')
                document.querySelectorAll('.results')[1].src = images
                document.querySelectorAll('.results')[0].href = images

                window.userData = top.userData = [
                    null,
                    null,
                    user.username,
                    '#' + user.id,
                    formatNumber(user.friends) + '/' + user.friends_limit,
                    formatNumber(user.gold),
                    formatNumber(user.silver),
                    formatNumber(rank),
                    formatNumber(user.level),
                    `${formatNumber(user.xp)} / ${formatNumber(user.next_level_xp)} (${user.level_progress.toFixed(2)}%)`,
                    formatNumber(user.previous_level_xp),
                    time
                ]

                let results = document.querySelectorAll('.results')
                for (let i = 2; i < results.length; i++) {
                    results[i].textContent = userData[i]
                }

            }).catch((e) => {
                document.getElementById('alert-error').style.display = 'block'
                document.getElementById('alert-error').scrollIntoView()
            })
    });
}

setTimeout(() => scrollTo(null, 0), 100)

window.onload = function () {
    const formatNumber = num => Number(num).toLocaleString().replaceAll(',', ' ').replaceAll('.', ' ')

    let submit = document.getElementById('submit');
    let input = document.getElementById('input');

    function getData (body) {
        const firstIndex = body.indexOf('options.bootstrap = {') + 20;
        const lastIndex = body.indexOf('};', firstIndex) + 1;
        const text = body.substring(firstIndex, lastIndex)
        return JSON.parse(text)
    }
    
    function getRank (body) {
        const firstIndex = body.indexOf('icon-crown')
        const lastIndex = body.indexOf('xp progression-item', firstIndex)
        const text = body.substring(firstIndex, lastIndex);
        return text.replace(/\D/g, '')
    }
    
    function getDate (body) {
        let date = new Date(body.created)
        let days = date.toDateString()
        let time = date.toUTCString().slice(17, 25)
        
        return `${days}, ${time}`
    }

    const TIME_UNITS = {
        years: 31557600000,
        months: 2629800000,
        weeks: 604800000,
        days: 86400000,
        hours: 3600000,
        minutes: 60000,
        seconds: 1000
    };

    const dateDifference = (date1, date2) => {
        let diff = Math.abs(date1 - date2);
        const res = {};
        for (const unit in TIME_UNITS) {
            res[unit] = Math.floor(diff / TIME_UNITS[unit]);
            diff -= res[unit] * TIME_UNITS[unit];
        }
        return res;
    };    

    input.addEventListener('keypress', function (e) {
        if (e.repeat) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            submit.click();
        }
    });

    submit.addEventListener('click', () => {
        let input = document.getElementById('input');

        fetch(`https://api.allorigins.win/get?url=https://www.kogama.com/profile/${input.value}/`)
        .then(async html => await html.text())
        .then((data) => {
            document.getElementById("alert-error").style.display = "none"

            let user = getData(data).object;
            let rank = getRank(data)
            let time = getDate(user)
            const ageDifference = Math.abs(Date.now() - new Date(user.created).getTime());
            let ago = dateDifference(ageDifference, 0);
            
            document.getElementById('td-friends').textContent = `${formatNumber(user.friends)} / ${user.friends_limit}`
            document.getElementById('td-gold').textContent = formatNumber(user.gold)
            document.getElementById('td-silver').textContent = formatNumber(user.silver)
            document.getElementById('td-rank').textContent = formatNumber(rank)
            document.getElementById('td-level').textContent = user.level
            document.getElementById('td-xp').textContent = `${formatNumber(user.xp)} / ${formatNumber(user.next_level_xp)} (${user.level_progress.toFixed(2)}%)`

            document.getElementById('td-previousxp').textContent = formatNumber(user.previous_level_xp)
            document.getElementById('td-created').textContent = `${time} (${ago.years} years, ${ago.months} months, ${ago.days} days ago).`
            console.log(user.gold, user.silver, user.images.large, user.friends, user.friends_limit, rank, time)
        }).catch((e) => {
            document.getElementById("alert-error").style.display = "block"
            document.getElementById("alert-error").scrollIntoView()
        })
    });
}

setTimeout(() => {
    scrollTo(null, 0)
}, 100)

function scrollDown () {
    document.querySelector("body > div.container.p-5 > h4").scrollIntoView()
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

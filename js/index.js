let repoList = document.getElementById("repos-container");
let statDiv = document.getElementById("stat-github")
let accessToken = "";
let reposUrl = "";
let statUrl = "https://api.github.com/user/repos?per_page=1000&type=owner";
let user = "ValgulNecron"


window.onload = function () {
    repoList = document.getElementById("repos-container");
    statDiv = document.getElementById("stat-github");
    const form = document.getElementById('github-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const pseudonym = document.getElementById('pseudonym').value;
        const token = document.getElementById('token').value;
        user = pseudonym;
        if (token) {
            accessToken = token;
        }
        const headers = {
    Authorization: `Bearer ${accessToken}`,
};
        repoList.innerHTML = "";
        statDiv.innerHTML = "";
        data();
    })
    data()
}

function data() {
    if (accessToken !== "") {
        reposUrl = "https://api.github.com/search/repositories?q=user:" + user;
        statUrl = `https://api.github.com/users/${user}/repos?per_page=1000&type=owner`;
        fetch(reposUrl, {headers})
            .then(response => response.json())
            .then(data => {
                const repos = data.items;
                repos.forEach(repo => {
                    const isPrivate = repo.private;
                    const visibility = isPrivate ? "Privé" : "Public";
                    repoList.innerHTML += `        
            <div class="projet clickable" onclick="window.location.href='${repo.html_url}'">
            <h2>${repo.name}</h2>
            <p>Langage : ${repo.language}</p>
            <p>Nombre de stars : ${repo.stargazers_count}</p>
            <p>Visibilité : ${visibility}</p>
            </div>
          `;
                });
            });


        fetch(statUrl, {headers})
            .then(response => response.json())
            .then(data => {

                const languages = {};
                data.forEach(repo => {
                    if (repo.language) {
                        if (languages[repo.language]) {
                            languages[repo.language]++;
                        } else {
                            languages[repo.language] = 1;
                        }
                    }
                });
                const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5);

                const languagesDiv = document.createElement('div');
                languagesDiv.className = 'languages-div';
                languagesDiv.innerHTML = 'Top 5 des langages:    ';
                sortedLanguages.forEach(lang => {
                    const langDiv = document.createElement('div');
                    langDiv.innerHTML = ` ${lang[0]}: ${lang[1]}; `;
                    langDiv.className = 'lang-div';
                    languagesDiv.appendChild(langDiv);
                });
                statDiv.appendChild(languagesDiv);

                const publicRepos = data.filter(repo => repo.private === false);
                const publicReposCount = publicRepos.length;

                const privateRepos = data.filter(repo => repo.private === true);
                const privateReposCount = privateRepos.length;

                const totalReposCount = publicReposCount + privateReposCount;
                const reposDiv = document.createElement('div');
                reposDiv.innerHTML = `Nombre de dépôts: ${totalReposCount} (${publicReposCount} publics, ${privateReposCount} privés)`;
                reposDiv.className = 'repos-div';
                statDiv.appendChild(reposDiv);
            });
    } else {
        statUrl = `https://api.github.com/users/${user}/repos?per_page=1000&type=owner`;
        reposUrl = "https://api.github.com/search/repositories?q=user:" + user;
        fetch(reposUrl)
            .then(response => response.json())
            .then(data => {
                const repos = data.items;
                repos.forEach(repo => {
                    const isPrivate = repo.private;
                    const visibility = isPrivate ? "Privé" : "Public";
                    repoList.innerHTML += `        
            <div class="projet clickable" onclick="window.location.href='${repo.html_url}'">
            <h2>${repo.name}</h2>
            <p>Langage : ${repo.language}</p>
            <p>Nombre de stars : ${repo.stargazers_count}</p>
            <p>Visibilité : ${visibility}</p>
            </div>
          `;
                });
            });


        fetch(statUrl)
            .then(response => response.json())
            .then(data => {

                const languages = {};
                data.forEach(repo => {
                    if (repo.language) {
                        if (languages[repo.language]) {
                            languages[repo.language]++;
                        } else {
                            languages[repo.language] = 1;
                        }
                    }
                });
                const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5);

                const languagesDiv = document.createElement('div');
                languagesDiv.className = 'languages-div';
                languagesDiv.innerHTML = 'Top 5 des langages:    ';
                sortedLanguages.forEach(lang => {
                    const langDiv = document.createElement('div');
                    langDiv.innerHTML = ` ${lang[0]}: ${lang[1]}; `;
                    langDiv.className = 'lang-div';
                    languagesDiv.appendChild(langDiv);
                });
                statDiv.appendChild(languagesDiv);

                const publicRepos = data.filter(repo => repo.private === false);
                const publicReposCount = publicRepos.length;

                const reposDiv = document.createElement('div');
                reposDiv.innerHTML = `Nombre de dépôts: ${publicReposCount}`;
                reposDiv.className = 'repos-div';
                statDiv.appendChild(reposDiv);
            });
    }
}



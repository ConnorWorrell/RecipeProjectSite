var searchElem = document.getElementById("search-input");
var posts;
function loadSearch() { 
    // call the index.json file from server by http get request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data) {
					console.log(data)
                    posts = data; // load json data
                }
            } else {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.open('GET', "../index.json");
    xhr.send();
}
loadSearch(); // call loadsearch to load the json file
//console.log(posts)
function showSearchResults() {
	console.log("ShowSearchResults")
    var query = document.getElementById("search-input").value || ''; // get the value from input
    //var searchString = query.replace(/[^\w\s]/gi, ''); // clear white spaces
	var searchString = query
	console.log(query, searchString)
    var target = document.getElementById('list'); // target the ul list to render the results
    var postsByTitle = posts.reduce((acc, curr) => { // map lunr search index to your articles
        acc[curr.title] = curr;
        return acc;
    }, {}
    );

    // build lunr index file
	//var index = lunr.Index.load(postsByTitle);
	//console.log("index",index);
	
    //var index = lunr(function () {
    //    this.ref('title')
    //    this.field('contents')
    //    posts.forEach(function (doc) {
	//		console.log("doc",doc);
    //        this.add(doc)
    //    }, this)
	//	console.log(this)
    //});
	
	const options = { includeScore: true, keys: ['title', 'contents']}
	const index = new Fuse(posts,options)
	
    // search in lunr index
    if (searchString && searchString != '') {
        var matches = index.search(searchString);
        var matchPosts = [];
		console.log("matches", matches.length, matches, searchString);
        matches.forEach((m) => {
            matchPosts.push(postsByTitle[m.item.title]);
        });
        if (matchPosts.length > 0) {
			console.log(matchPosts)
            // match found with input text and lunr index
            target.innerHTML = matchPosts.map(function (p) {
                if (p != undefined) {
                    return `<li>
                        <a href="${p.permalink}"> ${p.title}</a>
                        </li>`;
                }
            }).join('');
        } else {
            // if no results found, then render a general message
            target.innerHTML = `<br><h2 style="text-align:center">No search results found for: ${searchString}</h2>`;
        };
    } else {
        target.innerHTML = ''
    }
};

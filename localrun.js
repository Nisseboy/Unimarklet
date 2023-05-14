javascript:(async function(){res = await fetch('index.js').then(a=>a.text()); let source = res; eval(res);})()

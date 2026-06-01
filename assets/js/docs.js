// Mobile drawer
var sidebar=document.getElementById('sidebar'),
    scrim=document.getElementById('scrim'),
    btn=document.getElementById('menuBtn');
function closeDrawer(){sidebar.classList.remove('open');scrim.classList.remove('show');}
if(btn){btn.addEventListener('click',function(){sidebar.classList.add('open');scrim.classList.add('show');});}
scrim.addEventListener('click',closeDrawer);
document.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',closeDrawer);});

// Scroll-spy
var links=[].slice.call(document.querySelectorAll('nav a'));
var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
var obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      links.forEach(function(l){l.classList.remove('active');});
      var act=map[e.target.id];
      if(act){act.classList.add('active');
        // keep active item in view within sidebar
        var r=act.getBoundingClientRect(),sr=sidebar.getBoundingClientRect();
        if(r.top<sr.top+70||r.bottom>sr.bottom-20){act.scrollIntoView({block:'nearest'});}
      }
    }
  });
},{rootMargin:'-10% 0px -75% 0px',threshold:0});
document.querySelectorAll('section[id]').forEach(function(s){obs.observe(s);});

const pages = [...document.querySelectorAll('.page')];
const yesBtn = document.querySelector('#yesBtn');
const noBtn = document.querySelector('#noBtn');
const hint = document.querySelector('#hint');
const date = document.querySelector('#date');
const dateHint = document.querySelector('#dateHint');
const selected = new Set();
let yesScale = 1, noCount = 0;

function showPage(n){ pages.forEach(p=>p.classList.remove('active')); document.querySelector('#page-'+n).classList.add('active'); }
function next(n){ showPage(n); }
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>next(b.dataset.next)));

yesBtn.addEventListener('click',()=>showPage(2));
function escapeNo(){
  noCount++; yesScale = Math.min(2.35, yesScale + .17); yesBtn.style.transform=`scale(${yesScale})`;
  const maxX=110, maxY=45;
  noBtn.style.transform=`translate(${(Math.random()*2-1)*maxX}px, ${(Math.random()*2-1)*maxY}px)`;
  const lines=['Are you sure? 👀','Wrong button 😭','The YES looks cute...','Nice try hehe','It is getting bigger ✦'];
  hint.textContent=lines[Math.min(noCount-1,lines.length-1)];
}
noBtn.addEventListener('mouseenter',escapeNo); noBtn.addEventListener('click',escapeNo);

document.querySelector('#dateContinue').addEventListener('click',()=>{
  if(!date.value){dateHint.textContent='Pick a day first ♡';return;}
  dateHint.textContent='';showPage(4);
});

document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
  const value=btn.textContent.trim();
  if(selected.has(value)){selected.delete(value);btn.classList.remove('selected')}else{selected.add(value);btn.classList.add('selected')}
}));

document.querySelector('#lockBtn').addEventListener('click',()=>{
  const choiceHint=document.querySelector('#choiceHint');
  if(!selected.size){choiceHint.textContent='Choose at least one adventure ♡';return;}
  
  const prettyDate=new Date(date.value+'T00:00:00').toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'});
  const choicesString = [...selected].join(' + ');
  
  document.querySelector('#selectedDate').value = prettyDate;
  document.querySelector('#selectedChoices').value = choicesString;

  document.querySelector('#summary').innerHTML=`${prettyDate} ✦<br>${choicesString}`;
  showPage(5);
});

// Submit form via fetch to Formspree in the background without breaking the page experience
const formElement = document.querySelector('form');
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(formElement);

  fetch(formElement.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  }).catch((error) => console.error('Form submission error:', error));

  showPage(6);
});

document.querySelector('#restart').addEventListener('click',()=>{selected.clear();document.querySelectorAll('.choice').forEach(b=>b.classList.remove('selected'));date.value='';noCount=0;yesScale=1;yesBtn.style.transform='';noBtn.style.transform='';hint.textContent='Be nice... say yes! ♡';showPage(1);});

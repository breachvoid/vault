'use strict';
const input = document.querySelector('#search');
const buttons = [...document.querySelectorAll('[data-category]')];
const groups = [...document.querySelectorAll('#directory .guide-group')].map(element => ({element, rows:[...element.querySelectorAll('li')]}));
const status = document.querySelector('#filter-status');
const selectedCategories = new Set();
const normalise = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
function filter() {
 const terms = normalise(input.value).trim().split(/\s+/).filter(Boolean);
 let any = false;
 let visibleGroups = 0;
 for (const group of groups) {
  let shown = false;
  for (const row of group.rows) {
   const matches = (!selectedCategories.size || selectedCategories.has(group.element.id)) && terms.every(term => ['os','p','f','f+'].includes(term) ? row.dataset.badges.toLowerCase().split(' ').includes(term) : normalise(row.dataset.search).includes(term));
   row.hidden = !matches;
   if (matches) shown = any = true;
  }
  group.element.hidden = !shown;
  if (shown) group.element.classList.toggle('surface-dark',visibleGroups++ % 2 === 0);
 }
 for (const button of buttons) button.setAttribute('aria-pressed',String(button.dataset.category === 'all' ? !selectedCategories.size : selectedCategories.has(button.dataset.category)));
 document.querySelector('#empty').hidden = any;
 const categories = buttons.filter(button => selectedCategories.has(button.dataset.category)).map(button => button.textContent).join(', ');
 status.textContent = any ? (categories || 'All categories') + (input.value ? '. Search applied.' : '. Search cleared.') : 'No matching websites.';
}
input.addEventListener('input',filter);
for (const button of buttons) button.addEventListener('click',()=>{
 const category = button.dataset.category;
 if (category === 'all') {selectedCategories.clear();input.value='';}
 else if (selectedCategories.has(category)) selectedCategories.delete(category);
 else selectedCategories.add(category);
 filter();
});
const legend = document.querySelector('.legend');
const help = document.querySelector('.legend-help-toggle');
help.addEventListener('click',()=>{const open=legend.classList.toggle('help-open');help.setAttribute('aria-expanded',String(open));legend.classList.toggle('help-dismissed',!open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){legend.classList.remove('help-open');help.setAttribute('aria-expanded','false');legend.classList.add('help-dismissed');}});
legend.addEventListener('pointerleave',()=>legend.classList.remove('help-dismissed'));
legend.addEventListener('focusout',event=>{if(!legend.contains(event.relatedTarget))legend.classList.remove('help-dismissed');});
filter();

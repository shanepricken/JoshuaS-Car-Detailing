'use strict';
const prices={sedan:{exterior:65,interior:85,full:140},suv:{exterior:75,interior:95,full:150},large:{exterior:95,interior:115,full:175}};
const vehicleLabels={sedan:'Sedan',suv:'SUV',large:'Large SUV / Truck'};
const serviceLabels={exterior:'Exterior detail',interior:'Interior detail',full:'Full detail'};
let selectedVehicle='sedan';
const dialog=document.querySelector('#booking-dialog');
const vehicleSelect=document.querySelector('#vehicle-select');
const serviceSelect=document.querySelector('#service-select');
const seatsInput=document.querySelector('#seats');
const floorInput=document.querySelector('#floor');
const petsInput=document.querySelector('#pets');
const firstTime=document.querySelector('#first-time');
const form=document.querySelector('#estimate-form');
const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
function selectVehicle(vehicle){selectedVehicle=vehicle;document.querySelectorAll('[data-vehicle]').forEach(button=>{const active=button.dataset.vehicle===vehicle;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-price]').forEach(element=>element.textContent='$'+prices[vehicle][element.dataset.price]);document.querySelectorAll('.vehicle-name').forEach(element=>element.textContent='/ '+vehicleLabels[vehicle].toLowerCase());}
document.querySelectorAll('[data-vehicle]').forEach(button=>button.addEventListener('click',()=>selectVehicle(button.dataset.vehicle)));
function estimate(){const seats=Math.min(12,Math.max(0,Math.floor(Number(seatsInput.value)||0)));const base=prices[vehicleSelect.value][serviceSelect.value];const extras=seats*15+(floorInput.checked?20:0)+(petsInput.checked?20:0);return{seats,base,extras,total:base*(firstTime.checked?.85:1)+extras};}
function updateEstimate(){const value=estimate();document.querySelector('#estimate-total').textContent=money(value.total);document.querySelector('#estimate-note').textContent=firstTime.checked?'15% off package + selected extras':'Package + selected extras';document.querySelector('#copy-status').textContent='';document.querySelector('#message-fallback').hidden=true;}
function openBooking(service,offer=false){vehicleSelect.value=selectedVehicle;serviceSelect.value=service||'full';if(offer)firstTime.checked=true;updateEstimate();dialog.showModal();document.body.classList.add('dialog-open');}
document.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>openBooking(button.dataset.book)));
document.querySelector('[data-first-book]').addEventListener('click',()=>openBooking('full',true));
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
form.addEventListener('input',updateEstimate);
seatsInput.addEventListener('change',()=>{seatsInput.value=estimate().seats;updateEstimate();});
function message(){const e=estimate();const extras=[];if(e.seats)extras.push(`stain extraction for ${e.seats} seat(s)`);if(floorInput.checked)extras.push('full floor extraction');if(petsInput.checked)extras.push('extreme pet hair removal');return `Hi Joshua! I'd like to arrange a ${serviceLabels[serviceSelect.value].toLowerCase()} for a ${vehicleLabels[vehicleSelect.value]}.${extras.length?' Extras: '+extras.join(', ')+'.':''}${firstTime.checked?" This is my first detail; I'd like to use the 15% offer.":''} The website estimate is ${money(e.total)}. Can we confirm the price, service area, and an available time?`;}
form.addEventListener('submit',event=>{event.preventDefault();const separator=/iPad|iPhone|iPod/.test(navigator.userAgent)?'&':'?';window.location.href='sms:+18627770163'+separator+'body='+encodeURIComponent(message());document.querySelector('#copy-status').textContent='Text app not opening? Copy your inquiry below or call Joshua.';});
document.querySelector('.copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message());document.querySelector('#copy-status').textContent='Inquiry copied. Paste it into a text to 862-777-0163.';}catch{const fallback=document.querySelector('#message-fallback');fallback.value=message();fallback.hidden=false;fallback.focus();fallback.select();document.querySelector('#copy-status').textContent='Select and copy the inquiry below.';}});
const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.header nav');
function closeMenu(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');}
menuToggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(opened));menuToggle.setAttribute('aria-label',opened?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();

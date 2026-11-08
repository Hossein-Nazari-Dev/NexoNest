const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {document:{addEventListener(){}}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/project-page.js'),'utf8'),context);

function fixture() {
  class Element {
    constructor() { this.handlers = {}; }
    addEventListener(type, handler) { (this.handlers[type] ??= []).push(handler); }
    emit(type, target = this) { for (const handler of this.handlers[type] ?? []) handler({target}); }
  }
  const queued = [], player = new Element(), dialog = new Element();
  const close = new Element(), first = new Element(), second = new Element(), title = {};
  const counts = {pause:0,load:0,play:0,close:0,show:0};
  first.dataset = {video:'first.mp4',videoTitle:'First'};
  second.dataset = {video:'second.mp4',videoTitle:'Second'};
  player.hasAttribute = name => name === 'src' && player.src !== undefined;
  player.removeAttribute = () => {delete player.src;};
  player.pause = () => {counts.pause++;};
  player.load = () => {counts.load++;};
  player.play = () => {counts.play++;return Promise.resolve();};
  dialog.querySelector = selector => ({'.project-video-player':player,'#projectVideoTitle':title,'.project-video-close':close})[selector];
  dialog.showModal = () => {assert.ok(!dialog.open);dialog.open=true;counts.show++;};
  dialog.close = () => {assert.ok(dialog.open);dialog.open=false;counts.close++;queued.push(()=>dialog.emit('close'));};
  const root = {querySelector:()=>dialog,querySelectorAll:()=>[first,second]};
  const bind = context.initProjectVideo(root);
  bind();
  const flush = () => {while(queued.length)queued.shift()();};
  return {player,dialog,close,first,second,title,counts,bind,flush};
}

for (const exit of ['button','backdrop','native close']) {
  const f=fixture();
  f.first.emit('click');
  assert.equal(f.player.src,'first.mp4');
  if(exit==='button')f.close.emit('click');
  else if(exit==='backdrop')f.dialog.emit('click');
  else f.dialog.close();
  f.flush();
  assert.equal(f.dialog.open,false,exit);
  assert.equal(f.player.src,undefined,exit);
  assert.equal(f.counts.pause,1,exit);
  assert.equal(f.counts.load,1,exit);
  assert.equal(f.counts.close,1,exit);
  f.dialog.emit('close');
  assert.equal(f.counts.load,1,'Repeated cleanup must not reload');
  f.first.emit('click');
  assert.equal(f.counts.play,2,'Reopening must still play');
}

const switched=fixture();
switched.bind();
switched.first.emit('click');
assert.equal(switched.counts.play,1,'Rebinding must not duplicate listeners');
switched.second.emit('click');
assert.equal(switched.player.src,'second.mp4');
assert.equal(switched.title.textContent,'Second');
assert.equal(switched.counts.pause,1,'Switching must release the earlier source');
assert.equal(switched.counts.show,1,'Switching an open dialog must not open it again');
switched.close.emit('click');
switched.first.emit('click');
switched.flush();
assert.equal(switched.player.src,'first.mp4','Queued close must not release a newly opened video');
assert.equal(switched.dialog.open,true);
switched.dialog.close();switched.flush();
assert.equal(switched.player.src,undefined);
console.log('Project video: mocked exit, idempotence, rebind, switch and queued-close checks passed. Native Escape and media playback require the browser suite.');

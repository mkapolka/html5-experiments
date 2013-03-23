function Treasure() {
   this.rarity = 0;
   this.value = Math.floor(Math.random() * 100);
}

TraderTypes = {
   Naive: 0,
   Collector: 1,
   Savvy: 2,
}

function Person() {
   this.name = "Person Name";
   this.treasures = [];
   this.type = TraderTypes.Naive;
}

function initPeople() {
}

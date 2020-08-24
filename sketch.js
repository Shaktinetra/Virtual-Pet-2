var dog, dogImg, happyDogImg, database, food, foodStock, button1, button2, fedTime, lastFed, foodObj;

function preload() {
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500, 500);
  textSize(20);
  fill(255);

  foodObj = new Food();

  dog = createSprite(250, 350, 20, 20);
  dog.addImage("dog", dogImg);
  dog.addImage("happy", happyDogImg);
  dog.scale = 0.25;

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  button1 = createButton("Feed The Dog");
  button1.position(725, 100);
  button1.mousePressed(feedDog);

  button2 = createButton("Add Food");
  button2.position(725, 125);
  button2.mousePressed(addFood);
}

function draw() {  
  background(46, 139, 87);
  foodObj.display();

  fill(255, 255, 255);
  textSize(15);

  if (lastFed >= 12) {
    text("Last Fed: " + lastFed%12 + " PM", 350, 30);
  } else if (lastFed === 0) {
    text("Last Fed : 12 AM", 350, 30);
  } else {
    text("Last Fed: " + lastFed + "AM", 350, 30);
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data) {
    lastFed = data.val();
  });

  drawSprites();
}

function readStock(data) {
  food = data.val();
  foodObj.updateFoodStock(food);
}

function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }

  database.ref('/').update ({
    Food: x
  });
}

function feedDog() {
  dog.changeImage("happy", happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFood() {
  food++;
  database.ref('/').update({
    Food: food
  })
}
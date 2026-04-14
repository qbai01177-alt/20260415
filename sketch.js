let colonies = [];
let bubbles = [];
let numWeeks = 2; // 只顯示兩週

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化兩個生態聚落
  // 一個放在左側 (1/3 處)，一個放在右側 (2/3 處)
  for (let i = 0; i < numWeeks; i++) {
    let x = width * (i + 1) / (numWeeks + 1);
    let y = height - 120;
    colonies.push(new Colony(i + 1, x, y));
  }
  
  // 背景小氣泡
  for (let i = 0; i < 15; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      speed: random(0.5, 2),
      size: random(3, 10)
    });
  }
}

function draw() {
  // 每次重繪前預設為箭頭，若有懸停到任何聚落才會在下方改為手勢
  cursor(ARROW);

  background(0, 20, 35); // 深海藍
  
  drawBubbles();
  drawSeaGrass();
  
  // 顯示上方標題
  fill(255, 200);
  textAlign(CENTER);
  textSize(24);
  text("時光記憶圖譜：雙週生態展", width/2, 50);

  // 更新並顯示 Week 1 與 Week 2 聚落
  for (let c of colonies) {
    c.update();
    c.display();
  }
}

class Colony {
  constructor(week, x, y) {
    this.week = week;
    this.baseX = x;
    this.baseY = y;
    this.angle = random(TWO_PI);
    this.size = 80; // 聚落稍微加大，視覺較豐富
  }

  update() {
    // 緩慢的水流晃動
    this.x = this.baseX + sin(frameCount * 0.02 + this.angle) * 12;
    this.y = this.baseY + cos(frameCount * 0.02 + this.angle) * 10;
  }

  display() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    let isHover = d < this.size / 2;

    push();
    translate(this.x, this.y);
    
    // 滑鼠移上去時的發光效果
    if (isHover) {
      noStroke();
      fill(0, 255, 255, 40);
      ellipse(0, 0, this.size * 1.5);
      cursor(HAND);
    }
    
    // 聚落主體 (像是一個海底發光體)
    stroke(255, 180);
    strokeWeight(3);
    fill(isHover ? color(255, 200, 50) : color(0, 150, 200, 180));
    ellipse(0, 0, this.size);

    // 週次文字
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(16);
    text("Week " + this.week, 0, 0);
    pop();
  }

  clicked() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.size / 2) {
      // 點擊後，讓本目錄下的 iframe 載入對應週次的資料夾
      let targetURL = "week" + this.week + "/week" + this.week + ".html";
      let frame = document.getElementById('myIframe');
      if(frame) frame.src = targetURL;
      console.log("切換至：" + targetURL);
    }
  }
}

// 點擊事件
function mousePressed() {
  for (let c of colonies) {
    c.clicked();
  }
}

// 海草與氣泡繪製 (維持原本邏輯)
function drawSeaGrass() {
  stroke(20, 100, 70, 120);
  strokeWeight(5);
  for (let x = 0; x < width; x += 100) {
    beginShape();
    noFill();
    for (let y = height; y > height - 100; y -= 20) {
      let xOff = sin(frameCount * 0.02 + x) * 20;
      curveVertex(x + xOff, y);
    }
    endShape();
  }
}

function drawBubbles() {
  noStroke();
  fill(255, 40);
  for (let b of bubbles) {
    ellipse(b.x, b.y, b.size);
    b.y -= b.speed;
    if (b.y < -20) b.y = height + 20;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
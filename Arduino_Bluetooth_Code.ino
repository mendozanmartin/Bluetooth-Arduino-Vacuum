
#include <hcsr04.h>
#define TRIG_PIN 2
#define ECHO_PIN 3

HCSR04 hcsr04(TRIG_PIN, ECHO_PIN, 20, 4000);
int fan = 4;
int rightForward = 6;
int rightBackward = 7;
int leftBackward = 8;
int leftForward = 5;
int PWM12 = 10;
int PWM34 = 11;
String automaticSend = "";
bool automaticStatus = false;
bool fanStatus = false;
String fanSend = "";
String serialSend = "";
int obstaclesEncountered = 0;


void setup() {
  // put your setup code here, to run once:


  Serial.begin(9600);
  pinMode(rightForward,OUTPUT); //right forward
  pinMode(rightBackward,OUTPUT); //right backward
  pinMode(leftBackward,OUTPUT); //left backward
  pinMode(leftForward,OUTPUT);//left forward
  pinMode(fan, OUTPUT); //fan on

}

void loop() {
  // put your main code here, to run repeatedly:
  analogWrite(PWM12, 160); //left
  analogWrite(PWM34, 184); //right
if (Serial.available() > 0) {
  char data = Serial.read();

  if (data == 'a') { //forward direction
    digitalWrite(rightForward, HIGH);
    digitalWrite(leftForward,HIGH);
    automaticStatus = true;

  }
  if (data == 'b') { //backward direction
    digitalWrite(leftBackward, HIGH);
    digitalWrite(rightBackward,HIGH);
    automaticStatus = true;

  }
  if(data == 'c') { //turn right
    digitalWrite(rightBackward, HIGH);
    digitalWrite(leftForward, HIGH);
        automaticStatus = true;

  }
  if(data == 'd') { //turn left
    digitalWrite(rightForward, HIGH);
    digitalWrite(leftBackward, HIGH);
        automaticStatus = true;

  }
  if (data == 'e') { //turn off
    digitalWrite(rightForward, LOW);
    digitalWrite(rightBackward, LOW);
    digitalWrite(leftBackward, LOW);
    digitalWrite(leftForward, LOW);
        automaticStatus = true;

  }
  if (data == 'f') { //turn fan on
    digitalWrite(fan, HIGH);
    fanStatus = true;
  }

  if (data == 'g') { //turn fan off
    digitalWrite(fan, LOW);
    fanStatus = false;
  }
  
if (data == 'p') {
  automaticStatus = false;
    if (hcsr04.distanceInMillimeters() <= 200) {
        obstaclesEncountered +=1; 
      digitalWrite(rightForward, LOW);
      digitalWrite(rightBackward, LOW);
      digitalWrite(leftBackward, LOW);
      digitalWrite(leftForward, LOW);
      delay(300);
      digitalWrite(leftBackward, HIGH);
      digitalWrite(rightBackward,HIGH);
      delay(900);
      digitalWrite(leftBackward, LOW);
      digitalWrite(rightBackward,LOW);
      delay(300);
      digitalWrite(rightBackward, HIGH);
      digitalWrite(leftForward, HIGH);
      delay(800);
      digitalWrite(rightBackward, LOW);
      digitalWrite(leftForward, LOW);
      delay(300);
  } else if (hcsr04.distanceInMillimeters() > 200) {
      digitalWrite(rightForward, HIGH);
      digitalWrite(leftForward,HIGH); 
}
}
  //automatic bit comparison
  if (automaticStatus == true) {
    automaticSend = "M";
  } else if (automaticStatus == false) {
    automaticSend = "A";
  }

  //fan bit comparison
  if (fanStatus == true) {
   fanSend = "I";
  } else {
   fanSend = "O";
  }

serialSend = automaticSend + String(ultrasonicLimiter(hcsr04.distanceInMillimeters())) + fanSend + String(obstaclesEncountered);

Serial.println(serialSend);
}
}

int ultrasonicLimiter(int x) {
  if(x >= 100 && x <= 999) {
  return x;
  }else if (x > 999) {
    return 999;
  } else if (x < 100) {
    return 100;
  } 
}

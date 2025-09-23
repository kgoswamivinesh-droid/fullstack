class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  displayInfo() {
    console.log(`Name: ${this.name}, Age: ${this.age}`)
  }
}

class Student extends Person {
  constructor(name, age, course) {
    super(name, age)
    this.course = course
  }

  displayInfo() {
    console.log(`Name: ${this.name}, Age: ${this.age}, Course: ${this.course}`)
  }
}

class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age)
    this.subject = subject
  }

  displayInfo() {
    console.log(`Name: ${this.name}, Age: ${this.age}, Subject: ${this.subject}`)
  }
}

const student1 = new Student("Ashish", 21, "Computer Science")
const teacher1 = new Teacher("Dr. Sharma", 45, "Mathematics")

student1.displayInfo()
teacher1.displayInfo()

Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//**// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	if(welcome !== undefined){
		game.printStory(welcome)
	} else{
		//nothing
	}
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}

//**// Room Definition
function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//**// Object Definition
function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

//**// Door Definition
function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

//**// Keypad Definition
function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})

//**// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

//**// Computer Definition
function Computer(room, name, image, message){
	Object.call(this, room, name, image)

    // computer properties
	this.message = message
}

Computer.prototype = new Object

Computer.member('onClick', function(){
	printMessage(this.message)
})

//**// Direction Definition
function Direction(room, name, Image, connectedTo){
	Object.call(this, room, name, Image)

	this.Image = Image
	this.connectedTo = connectedTo
}

Direction.prototype = new Object()

Direction.member('onClick', function(){
	Game.move(this.connectedTo)
})

//**// openclose Definition
function openclose(room, name, closedImage, openedImage){
	Object.call(this, room, name, closedImage)

    // openclose properties
	this.closedImage = closedImage
	this.openedImage = openedImage
}

openclose.prototype = new Object()

openclose.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	} else if (this.id.isOpened){
		this.id.close()
	}
})
openclose.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
openclose.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

//**// Item Definition
function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})


////****//// 방 생성
room1 = new Room('room1', '배경-1.png')		
room2 = new Room('room2', '배경-4.png')		
room3 = new Room('room3', '배경-3.png')		
storage = new Room('storage', '창고.jpg')
lab = new Room('lab', '실험실.jpg')

////*** 첫번째 방 ***////
room1.door = new Door(room1, 'door', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room2)
room1.door.resize(120)
room1.door.locate(1000, 312)
room1.door.lock()
room1.door.onClick = function(){
	if(room1.keypad.isLocked()){
		printMessage('잠겨있다')
	} else if(!room1.keypad.isLocked()){
		Game.move(this.connectedTo)
		playSound('무전3.wav')
		printMessage('잘하셨습니다\n계속 진행해주세요')
	}
}

playSound('무전3.wav') 

room1.keypad = new DoorLock(room1, 'keypad', '숫자키-우.png', '0000', room1.door, '문이 열렸다') // 키패드
room1.keypad.resize(50) // 키패드 사이즈
room1.keypad.locate(1100, 310) // 키패드 위치 변경

room1.table = new Object(room1, 'table', '테이블-오른쪽.png')
room1.table.resize(300)
room1.table.locate(550, 400)

room1.twradio = new Item(room1, 'twradio', '무전기.jpg')
room1.twradio.resize(40)
room1.twradio.locate(560, 270)
room1.twradio.onClick = function(){
	playSound('무전3.wav')
	printMessage('지금부터 그곳에서 탈출하셔야 합니다 건투를 빕니다')
	this.id.pick()
}

room1.key = new Item(room1, 'key', '열쇠.png')
room1.key.resize(45)
room1.key.locate(745, 500)


////*** 두번째 방 ***////
room2.door1 = new Door(room2, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room1)
room2.door1.resize(120)
room2.door1.locate(300, 270)

room2.door2 = new Door(room2, 'door2', '문2-우-닫힘.png', '문2-우-열림.png', room3)
room2.door2.resize(120)
room2.door2.locate(1000, 305)
room2.door2.hide()

room2.keypad1 = new Keypad(room2, 'keypad1', '키패드-우.png', '1234', function(){
	printMessage('스르륵 문이 보인다')
	room2.door2.show()
})
room2.keypad1.resize(20)
room2.keypad1.locate(920, 250)

// onClick 함수를 재정의할 수도 있다
room2.keypad1.onClick = function(){
	printMessage('1234')
	showKeypad('number', this.password, this.callback)
}

////*** 세번째 방 ***////
room3.door1 = new Door(room3, 'door1', '문2-좌-닫힘.png', '문2-좌-열림.png', room2)
room3.door1.resize(120)
room3.door1.locate(300, 320)

room3.door2 = new Door(room3, 'door2', '문3-우-닫힘.png', '문3-우-열림.png', storage)
room3.door2.resize(120)
room3.door2.locate(1000, 320)
room3.door2.lock()

room3.lock1 = new DoorLock(room3, 'lock1', '키패드-우.png', '1234', room3.door2, '철커덕')
room3.lock1.resize(20)
room3.lock1.locate(920, 250)
room3.lock1.onClick = function(){
	printMessage('1234')
	showKeypad('number', this.password, this.callback)
}

////*** 창고 ***////
storage.door = new Direction(storage, 'door', '투명.png', lab)
storage.door.resize(280)
storage.door.locate(690,350)
storage.door.lock()
storage.door.onClick = function(){
	if(storage.lock.isLocked()){
		printMessage('닫혀있다\n아무래도 저 자물쇠를 열어야 하는 모양이다')
	} else if(!storage.lock.isLocked()){
		Game.move(this.connectedTo)
	}
}

storage.direction = new Direction(storage, 'direction', '아래.png', room3)
storage.direction.resize(23)
storage.direction.locate(640, 697)

storage.lock = new openclose(storage, 'lock', '자물쇠-잠김.png', '자물쇠-열림.png')
storage.lock.resize(40)
storage.lock.locate(815, 490)
storage.lock.lock()
storage.lock.onClick = function(){
	if(room1.key.isHanded()){
		this.id.setSprite(this.openedImage)
		this.id.unlock()
	} else if(!room1.key.isHanded()){
		printMessage('이 자물쇠.. 혹시 아까 그거로?')
	}
}

////*** 실험실 ***////
lab.setRoomLight(0.01) // 방 밝기를 0.01로 변경
lab.event = new Object(lab, 'event', '투명.png')
lab.event.resize(1000)
lab.event.locate(640, 420)
lab.event.onClick = function(){
	playSound('전기충격.wav')
	printMessage('지지지지직!!')
	Game.end()
}


Game.start(room1, '아아, 들리십니까?\n\n들리십니까??!\n\n(일부 효과음이 있습니다)')
// 산업보안학과 20184887 박지균

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
Object.member('moveX', function(x){
	this.id.moveX(x)
})
Object.member('moveY', function(y){
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

Door.prototype = new Object() // inherited from Object

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

//**// Direction Definition
function Direction(room, name, Image, connectedTo){
	Object.call(this, room, name, Image)

	this.Image = Image
	this.connectedTo = connectedTo
}

Direction.prototype = new Object() // inherited from Object

Direction.member('onClick', function(){
	Game.move(this.connectedTo)
})

//**// openclose Definition
function openclose(room, name, closedImage, openedImage){
	Object.call(this, room, name, closedImage)

	this.closedImage = closedImage
	this.openedImage = openedImage
}

openclose.prototype = new Object() // inherited from Object

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

//**// Keypad Definition
function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	this.password = password
	this.callback = callback
}

Keypad.prototype = new Object() // inherited from Object

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})

//**// Item Definition
function Item(room, name, image){
	Object.call(this, room, name, image)
}

Item.prototype = new Object() // inherited from Object

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})

//**// Computer Definition
function Computer(room, name, image, message){
	Object.call(this, room, name, image)

	this.message = message
}

Computer.prototype = new Object // inherited from Object

Computer.member('onClick', function(){
	printMessage(this.message)
})


////****//// 방 생성
room1 = new Room('room1', '배경-1.png')		
room2 = new Room('room2', '배경-4.png')		
room3 = new Room('room3', '배경-3.png')		
storage = new Room('storage', '창고.jpg')
lab = new Room('lab', '실험실.jpg')

////*** 첫번째 방 ***////

room1.door = new Direction(room1, 'door', '문-오른쪽-닫힘.png', room2)
room1.door.resize(120)
room1.door.locate(1000, 312)
room1.door.lock()
room1.door.onClick = function(){
	if(this.id.isLocked()){
		printMessage('잠겨있다')
	} else if(!this.id.isLocked()){
		Game.move(this.connectedTo)
		playSound('무전3.wav')
		printMessage('잘하셨습니다\n계속 진행해주세요')
	}
}

playSound('무전3.wav') 

room1.cryptex = new Object(room1, 'cryptex', 'cryptex.png')
room1.cryptex.resize(50)
room1.cryptex.locate(1100, 310)
room1.cryptex.onClick = function(){
	printMessage('스스로 보유한 능력에 의해 주어진 일을 자동으로 처리하는 기계')
	showKeypad('alphabet', 'ROBOT', function(){
		room1.door.unlock()
		room1.door.setSprite('문-오른쪽-열림.png')
		printMessage('문이 열렸다')
	})
}

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

room1.robot = new Object(room1, 'robot', 'Boston_robot.png')
room1.robot.resize(400)
room1.robot.locate(230, 340)
room1.robot.onClick = function(){
	printMessage('만져도 아무 반응이 없다')
}

////*** 두번째 방 ***////
room2.door1 = new Direction(room2, 'door1', '문-왼쪽-닫힘.png', room1)
room2.door1.resize(120)
room2.door1.locate(300, 270)

room2.door2 = new Direction(room2, 'door2', '문2-우-닫힘.png', room3)
room2.door2.resize(120)
room2.door2.locate(920, 295)
room2.door2.hide()

room2.closet = new Object(room2, 'closet', '옷장-2-닫힘.png')
room2.closet.resize(280)
room2.closet.locate(960, 280)
room2.closet.lock()
room2.closet.onClick = function(){
	if(this.id.isLocked()){
		printMessage('꼼짝도 하지 않는다')
	} else if(!this.id.isLocked()){
		printMessage('옷장을 밀어버렸다')
		this.id.move(170, 40)
		room2.door2.show()
		this.id.lock()
		}
}

room2.phone = new Object(room2, 'phone', '전화기-오른쪽.png')
room2.phone.resize(30)
room2.phone.locate(700, 230)
room2.phone.onClick = function(){
	if(room2.closet.isLocked()){
		showKeypad('telephone', '410', function(){
			room2.closet.unlock()
			printMessage('기계장치들이 움직이는 소리가 들린다')
		})
	} else if(!room2.closet.isLocked()){
		printMessage('버튼을 눌러도 반응이 없다')
	}
}

room2.carpet = new Object(room2, 'carpet', '카펫.png')
room2.carpet.resize(440)
room2.carpet.locate(580, 560)

room2.memo = new Object(room2, 'memo', '포스트잇.png')
room2.memo.resize(30)
room2.memo.locate(380, 580)
room2.memo.hide()
room2.memo.onClick = function(){
	showImageViewer('포스트잇문제.jpg')
}

room2.carpet_folder = new Object(room2, 'carpet_folder', '투명.png')
room2.carpet_folder.resize(60)
room2.carpet_folder.locate(390, 590)
room2.carpet_folder.onClick = function(){
	room2.carpet.setSprite('카펫-접힘.png')
	room2.memo.show()
	this.id.hide()
}

////*** 세번째 방 ***////
room3.door1 = new Direction(room3, 'door1', '문2-좌-닫힘.png', room2)
room3.door1.resize(120)
room3.door1.locate(300, 320)

room3.door2 = new Direction(room3, 'door2', '문3-우-닫힘.png', storage)
room3.door2.resize(120)
room3.door2.locate(1000, 320)
room3.door2.lock()

room3.lock1 = new Object(room3, 'lock1', '키패드-우.png', '1234', room3.door2)
room3.lock1.resize(20)
room3.lock1.locate(920, 250)
room3.lock1.onClick = function(){
	printMessage('과학기술의 중요성을 강조하고 앞으로의 발전을 위하는 날')
	showKeypad('number', '0421', function(){
		room3.door2.unlock()
		printMessage('철커덕')
	})
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


Game.start(room2, '아아, 들리십니까?\n\n들리십니까??!\n\n(일부 효과음이 있습니다)')
room = game.createRoom("room", "배경-1.png") // 방 생성
room2 = game.createRoom("room2", "배경-6.png") // 방2 생성

room.door = room.createObject("door", "문-오른쪽-닫힘.png") // 문 생성
room.door.setWidth(136) // 크기 조절
room.locateObject(room.door, 1049, 300) // 문 배치
room.door.lock() // door를 locked 상태로 변경

room.door.onClick = function() { // door를 클릭했을 때
	if(room.door.isClosed()){ // door가 closed 상태이면
		room.door.open() // door를 open
	} else if (room.door.isOpened()){ // door가 opened 상태이면
		game.move(room2) // room2로 이동
	} else if (room.door.isLocked()){ // door가 locked 상태이면
		printMessage("문이 잠겨있다") // 잠금 메시지 출력
	}
}

room.door.onOpen = function() { // door가 open 상태로 변경되면 실행
	room.door.setSprite("문-오른쪽-열림.png") // 열린 문으로 변경
}

room.keypad = room.createObject("keypad", "숫자키-우.png") // 오브젝트 생성
room.keypad.setWidth(50) // 크기 조절
room.locateObject(room.keypad, 930, 250) // 위치 변경

room.keypad.onClick = function() {
	printMessage("올해는 몇 년도?")
	showKeypad("number", "2019" , function(){ 
		room.door.unlock() // door의 잠금을 연다
		printMessage("잠금장치가 열리는 소리가 들렸다.") // 잠금 해제 메시지 출력
	 })
}

room.shelf = room.createObject("shelf", "선반-좌.png")
room.shelf.setWidth(460)
room.locateObject(room.shelf, 250, 150)

room.book = room.createObject("book", "책3-1.png")
room.book.setWidth(80)
room.locateObject(room.book, 100, 140)
room.book.onClick = function(){
    showImageViewer("종이.png", "책.txt"); // 이미지와 텍스트 파일 출력
}

room.phone = room.createObject("phone", "전화기-오른쪽.png")
room.phone.setWidth(30)
room.locateObject(room.phone, 830, 250)
room.phone.onClick = function(){
    playSound("alarm.wav") // 오디오 재생
}

room.radio = room.createObject("radio", "라디오.png")
room.radio.setWidth(90)
room.locateObject(room.radio, 100, 550)
room.radio.onClick = function(){
    printMessage("재생버튼을 눌러보세요")
    showAudioPlayer("chick.wav") // 플레이어
}

room.table = room.createObject("table", "테이블-우.png")
room.table.setWidth(300)
room.locateObject(room.table, 550, 400)

room.mac = room.createObject("mac", "맥-우.png")
room.mac.setWidth(130)
room.locateObject(room.mac, 560, 270)
room.mac.onClick = function(){
    showVideoPlayer("Wildlife.wmv") // 비디오 재생
}

room2.door = room2.createObject("door", "문-오른쪽-열림.png") // 문 생성
room2.door.setWidth(136) // 크기 조절
room2.locateObject(room2.door, 1049, 305) // 문 배치
room2.door.open() // door를 open 상태로 변경
room2.door.onClick = function(){
	game.move(room) // room으로 이동
}

room2.cupboard = room2.createObject("cupboard", "찬장-2-닫힘.png") // 찬장 생성
room2.key = room2.createObject("key", "열쇠.png") // 열쇠 생성
room2.key.hide() // key 숨기기

// 찬장, 열쇠 크기 조절 
room2.cupboard.setWidth(250)
room2.key.setWidth(45)

// 찬장, 열쇠 배치
room2.locateObject(room2.cupboard, 800, 323)
room2.locateObject(room2.key, 745, 315)

// 찬장, 열쇠 상태 변화
room2.cupboard.onOpen = function(){ // 찬장이 open 상태일 때
	room2.cupboard.setSprite("찬장-2-열림.png") // 열린 그림으로 변경
	room2.key.show() // key 보이기 
}
room2.cupboard.onClose = function(){ // 찬장이 close 상태일 때
	room2.cupboard.setSprite("찬장-2-닫힘.png") // 닫힌 그림으로 변경
	room2.key.hide() // key 숨기기 
}

room2.cupboard.onClick = function(){ // 찬장을 클릭했을 때
	if(room2.cupboard.isOpened()){ // 찬장이 opened 상태이면
		room2.cupboard.close() // 찬장을 close 
	} else if(room2.cupboard.isClosed()){ // 찬장이 closed 상태이면
		room2.cupboard.open() // 찬장을 open 
	} else{
		// 아무것도 하지 않는다
	}
}

room.head = room.createObject("head", "드라이버비트.png")
room.handle = room.createObject("handle", "드라이버손잡이.png")
room.screwdriver = room.createObject("screwdriver", "드라이버.png")

// 드라이버, 비트, 손잡이 크기 조절
room.head.setWidth(50)
room.handle.setWidth(50)
room.screwdriver.hide() // 조합 될 아이템 숨기기

// 드라이버 비트, 손잡이 배치
room.locateObject(room.head, 500, 650)
room.locateObject(room.handle, 600, 650)

room.head.onClick = function(){
	room.head.pick() // 줍기 
}
room.handle.onClick = function(){
	room.handle.pick()
}
game.makeCombination(room.head, room.handle, room.screwdriver) // 헤드 + 손잡이 = 드라이버

room.shelf.onClick = function(){
	if(game.getHandItem() == room.screwdriver){ // 드라이버를 들고 있으면
		printMessage("드라이버로 나사를 단단히 조였다")
	} else{
		printMessage("나사가 헐거워져있다")
	}
}

roomLight = true // 플래그 변수
room.remote = room.createObject("remote", "리모컨.png")
room.remote.setWidth(70)
room.locateObject(room.remote, 800, 550)
room.remote.onClick = function(){
	if(roomLight){
		room.setRoomLight(0.5)
		roomLight = false
	} else{
		room.setRoomLight(1)
		roomLight = true
	}
}

room2.door2 = room2.createObject("door2", "문3-좌-닫힘.png")
room2.door2.setWidth(136)
room2.locateObject(room2.door2, 170, 335)

room2.closet = room2.createObject("closet", "옷장-1-닫힘.png")
room2.closet.setWidth(300)
room2.locateObject(room2.closet, 250,305)

room2.closet.move = true // 플래그 변수 
room2.closet.onDrag = function(direction){ // 드래그 모션 direction - Up, Down, Left, Right
	if(direction == "Right" && room2.closet.move){ // 오른쪽으로 드래그했으면
		printMessage("옷장을 밀어버렸다!")
		room2.closet.moveX(200) // X방향으로 200 이동
		room2.closet.moveY(-40) // Y방향으로 -40 이동
		room2.closet.move = false // 이후에는 더이상 움직이지 않음
	} else{
		printMessage("열리지 않는다")
	}
}

room2.door2.onClick = function() { // door2를 클릭했을 때
	if(room2.door2.isClosed()){ // door2가 closed 상태이면
		room2.door2.open() // door2를 open
	} else if (room2.door2.isOpened()){ // door2가 opened 상태이면
		game.clear() // 게임 클리어
	} else {
		// 아무것도 하지 않는다
	}
}

game.start(room) // 게임시작
printMessage("방탈출에 오신 것을 환영합니다!") // 환영 메시지 출력
var JS2D;

var PlayStatus;

var TextureData;

var DrawData;

var RoadData;
var RoadAttribute = [
{no: -1},
{no: 12},
{no:  0}];

var RoadObjectAttribute = [
{no:  3}, //No. 00 LEFT
{no:  4}, //No. 01 RIGHT
{no:  6}, //No. 02 WOOD
{no:  8}, //No. 03 IRON FRAME
{no:  9}, //No. 04 ROCK
{no: 10}, //No. 05 COLA
{no: 14}, //No. 06 START
{no: 32}, //No. 07 IRON FRAME
{no: 34}, //No. 08 ROCK
{no: 35}, //No. 09 LONG IRON FRAME
{no:  5}, //No. 10 HOUSE
{no: 36}, //No. 11 LOW WOOD
{no: 37}, //No. 12 WOOD2
{no: 38}];//No. 13 TOWER

var RoadWork;
var SpriteCount;

var Matrix0;
var Matrix1;
var Matrix2;
var MatrixWorld;

var EyeRotationX;
var EyeRotationZ;

var CarsCount = 8;
var Cars = new Array(CarsCount + 3);
var CourseIndex;
var LapCount;
var EndCount;
var CourseCount = 6;

var ObjectFlag = true;


var canvas0;
function Js2dInit() {
	window.addEventListener("keyup", KeyUpFunc, true);
	window.addEventListener("keydown", KeyDownFunc, true);
	window.addEventListener("keypress", KeyDownFunc, true);

	canvas0 = document.getElementById("canvas0");
	if (!canvas0.getContext)
		return false;
	var ctx = canvas0.getContext("2d");



	var ImageData;
	TextureData = new Array(1024 * 1024);
	for(var i=0; i<TextureData.length; i++)
		TextureData[i] = 0;

	ctx.drawImage(Tex, 0, 0);
	ImageData = ctx.getImageData(0, 0, 320, 224);
	for(var j=0; j<224; j++)
		for(var i=0; i<320; i++)
			TextureData[j * 1024 + i] = ImageData.data[(j * 320 + i) * 4] | (ImageData.data[(j * 320 + i) * 4 + 1] << 8) | (ImageData.data[(j * 320 + i) * 4 + 2] << 16);

	ctx.drawImage(Map, 0, 0);
	ImageData = ctx.getImageData(0, 0, 320, 224);
	for(var j=0; j<224; j++)
		for(var i=0; i<320; i++)
			TextureData[j * 1024 + (i + 320)] = ImageData.data[(j * 320 + i) * 4] | (ImageData.data[(j * 320 + i) * 4 + 1] << 8) | (ImageData.data[(j * 320 + i) * 4 + 2] << 16);

	JS2D = new JS2DFunc();
	JS2D.Init("canvas0", 320, 224);
	JS2D.SetTextureData(TextureData);

	PlayStatus = 1;

	EyeRotationZ = 0;

	DrawData = JS2D.GetDrawDataArray(2000);

	SpriteCount = 0;

	Matrix0 = JS2D.GetMatrixArray();
	Matrix1 = JS2D.GetMatrixArray();
	Matrix2 = JS2D.GetMatrixArray();
	MatrixWorld = JS2D.GetMatrixArray();

	for(var i=0; i<Cars.length; i++)
		Cars[i] = {lastindex: 0, index: 0, details: 0, speed: 0, status: 0, x: 0, ex: 0, ey: 0, ez: 0, wx: 0, wy: 0, wz: 0, rx: 0, ry: 0, rz: 0, updown: 0, jumpz: 0, display: 0, rflag: 0, displayz: 0, mileage: 0, order: 0};

	Cars[0].index = 0;
	Cars[0].details = 0;

	Roads = new Array(CourseCount);
	for(i=0; i<CourseCount; i++)
		Roads[i] = {startindex: 0, data: [], no: [], count: 0, object: [],  objectno: [], objectcount: 0, mapdrawx: 0, mapdrawy: 0, mapx: 0, mapy: 0};

	RoadWork = new Array(1000 * 4);
	RoadData = new Array(1000);
	for(var i=0; i<RoadData.length; i++)
		RoadData[i] = {AcosY: 0, AcosX: 0, AcosYLast: 0, AcosYDiff: 0, DiffLeft: 0, DiffRight: 0, DiffX: 0, DiffY: 0, DiffZ: 0};

	var RoadTemplate = [0, 0, 256, 1, -750, 0, 0, 1, 750, 0, 0, 1, -1500, 0, 0, 1, 1500, 0, 0, 1, -640, 0, 0, 1, 640, 0, 0, 1];


	/**** COURSE 0 ****/
	Roads[0].startindex = 0;
	Roads[0].mapdrawx = 256;
	Roads[0].mapdrawy = 40;
	Roads[0].mapx = 261;
	Roads[0].mapy = 138;

	SetRoad(0, 0, 0, 0, 0, 1);

	SetRoadObjectLastRoadNo(0, 0, 0, 320, 0, 6);
	SetXnZRoadObjectLastRoadNo(0, 0, -640, 0, 0, 3);
	SetXnZRoadObjectLastRoadNo(0, 0, 640, 0, 0, 3);

	for(i=0; i<80; i++) {
		SetRoadLast(0, 0, 0, 256, 1);
		if(i < 48)
			Roads[0].data[(Roads[0].count - 1) * 4 + 1] = (12 - Math.abs(((i + 1) % 24) - 12)) * 30;
		if((i % 2) == 0) {
			SetXnZRoadObjectLastRoadLast(0, 750, 0, 0, 4);
			SetXnZRoadObjectLastRoadLast(0, -750, 0, 0, 4);
			SetRoadObjectLastRoadLast(0, 0, 480, 0, 8);
			SetLeftHitRoadLast(0, true);
			SetRightHitRoadLast(0, true);
		}
	}

	for(i=0; i<180; i+=4) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * i / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(0, RoadWork[0], RoadWork[1] + 24, RoadWork[2], 1);
		if((i % 8) == 0) {
			SetXnZRoadObjectLastRoadLast(0, RoadWork[4], 0, RoadWork[6], 4);
			SetXnZRoadObjectLastRoadLast(0, RoadWork[8], 0, RoadWork[10], 4);
		}

	}

	for(i=0; i<80; i++) {
		if(i < 27) {
			SetRoadLast(0, 0, -40, -256, 1);
			if((i % 2) == 0) {
				SetXnZRoadObjectLastRoadLast(0, 750, 0, 0, 4);
				SetXnZRoadObjectLastRoadLast(0, -750, 0, 0, 4);
			}
		} else {
			SetRoadLast(0, 0, 0, -256, 1);
			if((i % 4) == 0) {
				SetXnZRoadObjectLastRoadLast(0, 750, 0, 0, 2);
				SetXnZRoadObjectLastRoadLast(0, -750, 0, 0, 2);
			}
		}
	}

	for(i=0; i<176; i+=4) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (i + 180) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(0, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if(i <= 49) {
			if((i % 8) == 0) {
				SetXnZRoadObjectLastRoadLast(0, RoadWork[4], 0, RoadWork[6], 1);
				SetLeftHitRoadLast(0, true);
			}
		} else {
			if((i % 16) == 0)
				SetXnZRoadObjectLastRoadLast(0, RoadWork[4], 0, RoadWork[6], 2);
			if((i % 16) == 8) {
				SetXnZRoadObjectLastRoadLast(0, RoadWork[4], 0, RoadWork[6], 10);
				SetLeftHitRoadLast(0, true);
			}
		}
		if((i % 16) == 0)
			SetXnZRoadObjectLastRoadLast(0, RoadWork[8], 0, RoadWork[10], 2);
	}


	/**** COURSE 1 ****/
	Roads[1].startindex = 91;
	Roads[1].mapdrawx = 240;
	Roads[1].mapdrawy = 40;
	Roads[1].mapx = 248;
	Roads[1].mapy = 144;

	SetRoad(1, 0, 0, 0, 0, 2);

	var yy = 220
	for(i=0; i<yy; i+=8) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * ((360 - i) + yy) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(1, RoadWork[0], RoadWork[1] + 90, RoadWork[2], 2);
	}

	for(i=0; i<62; i++)
		SetRoadLast(1, 0, 90, 256, 2);

	SetRoadObjectLastRoadNoRelativeY(1, 32, -640, 0, 0, 9);
	SetRoadObjectLastRoadNoRelativeY(1, 32, 640, 0, 0, 9);

	SetRoadObjectLastRoadNo(1, 90, 0, 320, 0, 6);
	SetRoadObjectLastRoadNoRelativeY(1, 90, -640, 0, 0, 9);
	SetRoadObjectLastRoadNoRelativeY(1, 90, 640, 0, 0, 9);

	SetRoadLast(1, 0, -200, 256, 2);
	SetRoadLast(1, 0, -400, 256, 2);
	for(i=0; i<24; i++)
		SetRoadLast(1, 0, -275, 64, 2);

	for(i=0; i<12; i++)
		SetRoadLast(1, 0, -75, 256, 2);

	SetRoadObjectLastRoadNoRelativeY(1, 100, -640, 0, 0, 9);
	SetRoadObjectLastRoadNoRelativeY(1, 100, 640, 0, 0, 9);

	for(i=0; i<7; i++) {
		SetRoadLast(1, 0, 0, 256, 1);
		if((i % 2) == 1) {
			SetXnZRoadObjectLastRoadLast(1, -1500, 0, 0, 11);
			SetXnZRoadObjectLastRoadLast(1, 750, 0, 0, 11);
			SetRightHitRoadLast(1, true);
		}
	}

	for(i=0; i<yy; i+=4) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * i / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(1, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 8) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[12], 0, RoadWork[14], 11);
			if(i < 64) {
				SetXnZRoadObjectLastRoadLast(1, RoadWork[4], 0, RoadWork[6], 1);
				SetLeftHitRoadLast(1, true);
			}
		}
		if((i % 16) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[8], 0, RoadWork[10], 10);
			SetRightHitRoadLast(1, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * yy / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<25; i++) {
		SetRoadLast(1, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 2) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[8], 0, RoadWork[10], 11);
			SetXnZRoadObjectLastRoadLast(1, RoadWork[12], 0, RoadWork[14], 11);
			SetRightHitRoadLast(1, true);
		}
	}

	for(i=0; i<50; i+=5) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * ((360- i) + yy) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(1, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 2) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[8], 0, RoadWork[10], 0);
			SetRightHitRoadLast(1, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (yy - 50) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<15; i++) {
		SetRoadLast(1, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 2) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[12], 0, RoadWork[14], 11);
			SetXnZRoadObjectLastRoadLast(1, RoadWork[16], 0, RoadWork[18], 11);
		}
	}

	for(i=0; i<50; i+=5) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (i + (yy - 50)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(1, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 2) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[12], 0, RoadWork[14], 11);
			SetXnZRoadObjectLastRoadLast(1, RoadWork[4], 0, RoadWork[6], 1);
			SetLeftHitRoadLast(1, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (yy - 50 + 50) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<29; i++) {
		SetRoadLast(1, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(1, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(1, true);
			SetRightHitRoadLast(1, true);
		}
		if((i % 2) == 0) {
			SetXnZRoadObjectLastRoadLast(1, RoadWork[12], 0, RoadWork[14], 11);
			SetXnZRoadObjectLastRoadLast(1, RoadWork[16], 0, RoadWork[18], 11);
		}
	}


	/**** COURSE 2 ****/
	Roads[2].startindex = 118;
	Roads[2].mapdrawx = 224;
	Roads[2].mapdrawy = 40;
	Roads[2].mapx = 278;
	Roads[2].mapy = 44;

	SetRoad(2, 0, 0, 0, 0, 1);

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 270 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<38; i++) {
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 2);
			SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 2);
		}
		if((i % 4) == 2) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 10);
			SetXnZRoadObjectLastRoadLast(2, RoadWork[16], 0, RoadWork[18], 10);
			SetLeftHitRoadLast(2, true);
		}
	}

	for(i=0; i<200; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * ((360 - i) + 270) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[16], 0, RoadWork[18], 12);
			if(i < 60) {
				SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 0);
				SetRightHitRoadLast(2, true);
			}
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 70 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<4; i++) {
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 2) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 1);
			SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 12);
			SetLeftHitRoadLast(2, true);
			SetRightHitRoadLast(2, true);
		}
	}

	for(i=0; i<216; i+=8) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (i + 70) / 360);
		if(i<=8 * 11)
			JS2D.Vertex_Multiply([0, 50, 256, 1, -750, 0, 0, 1, 750, 0, 0, 1, -1500, 0, 0, 1, 1500, 0, 0, 1], Matrix0, RoadWork, 0, 0, 5);
		else if(i>=208 - 8 * 11)
			JS2D.Vertex_Multiply([0, -50, 256, 1, -750, 0, 0, 1, 750, 0, 0, 1, -1500, 0, 0, 1, 1500, 0, 0, 1], Matrix0, RoadWork, 0, 0, 5);
		else
			JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 2);
		if((i % 16) == 0)
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 4);
		if((i % 32) == 0)
			SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 12);
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 286 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<10; i++) {
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 12);
			SetLeftHitRoadLast(2, true);
		}
	}

	for(i=0; i<180; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * ((360 - i) + 286) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 7);
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);

		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 12);
			SetLeftHitRoadLast(2, true);
			if(i > 40) {
				SetXnZRoadObjectLastRoadLast(2, RoadWork[16], 0, RoadWork[18], 12);
			} else {
				SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 0);
				SetRightHitRoadLast(2, true);
			}
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 106 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<60; i++) {
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 12);
			SetXnZRoadObjectLastRoadLast(2, RoadWork[16], 0, RoadWork[18], 12);
			SetLeftHitRoadLast(2, true);
		}
		if((i % 8) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 11);
			SetRightHitRoadLast(2, true);
		}
	}

	SetRoadObjectLastRoadNo(2, 118, 0, 320, 0, 6);
	SetXnZRoadObjectLastRoadNo(2, 118, RoadWork[20], 0, RoadWork[22], 3);
	SetXnZRoadObjectLastRoadNo(2, 118, RoadWork[24], 0, RoadWork[26], 3);

	for(i=0; i<126; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * ((360 - i) + 106) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 12);
			SetXnZRoadObjectLastRoadLast(2, RoadWork[16], 0, RoadWork[18], 12);
			SetLeftHitRoadLast(2, true);
			if(i <= 40) {
				SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 0);
				SetRightHitRoadLast(2, true);
			}
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 340 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<38; i++) {
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 12);
			SetXnZRoadObjectLastRoadLast(2, RoadWork[16], 0, RoadWork[18], 12);
			SetLeftHitRoadLast(2, true);
		}
		if((i % 8) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 11);
			SetRightHitRoadLast(2, true);
		}
	}

	JS2D.Vertex_Multiply([0, 0, 200, 1, -750, 0, 0, 1, 750, 0, 0, 1, -1500, 0, 0, 1, 1500, 0, 0, 1], Matrix0, RoadWork, 0, 0, 5);
	SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);

	for(i=0; i<70; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * ((360 - i) + 340) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(2, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(2, RoadWork[4], 0, RoadWork[6], 12);
			SetXnZRoadObjectLastRoadLast(2, RoadWork[16], 0, RoadWork[18], 12);
			SetLeftHitRoadLast(2, true);
			if(i <= 40) {
				SetXnZRoadObjectLastRoadLast(2, RoadWork[8], 0, RoadWork[10], 0);
				SetRightHitRoadLast(2, true);
			}
		}
	}


	/**** COURSE 3 ****/
	Roads[3].startindex = 0;
	Roads[3].mapdrawx = 240;
	Roads[3].mapdrawy = 40;
	Roads[3].mapx = 275;
	Roads[3].mapy = 75;

	SetRoad(3, 0, 0, 0, 0, 1);

	SetRoadObjectLastRoadNo(3, 0, 0, 320, 0, 6);
	SetXnZRoadObjectLastRoadNo(3, 0, -640, 0, 0, 3);
	SetXnZRoadObjectLastRoadNo(3, 0, 640, 0, 0, 3);
	SetLeftHitRoadLast(3, true);
	SetRightHitRoadLast(3, true);

	for(i=0; i<26; i++) {
		SetRoadLast(3, 0, 0, 256, 1);
		if((i % 4) == 0 && (i < 8 || i >= 18)) {
			SetXnZRoadObjectLastRoadLast(3, 750, 0, 0, 11);
			SetRightHitRoadLast(3, true);
		}
	}

	for(i=0; i<200; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (360 - i) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 11);
			SetLeftHitRoadLast(3, true);
			if(i <= 80) {
				SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 0);
				SetRightHitRoadLast(3, true);
			} else
				SetXnZRoadObjectLastRoadLast(3, RoadWork[16], 0, RoadWork[18], 4);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (360 - 200) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<15; i++) {
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(3, true);
			SetRightHitRoadLast(3, true);
		}
	}

	for(i=0; i<90; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (360 - (200 - i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 1);
			SetLeftHitRoadLast(3, true);
		}
		if((i % 40) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 5);
			SetRightHitRoadLast(3, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (360 - (200 - 90)) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<12; i++) {
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 5);
			SetLeftHitRoadLast(3, true);
			SetRightHitRoadLast(3, true);
		}
	}

	for(i=0; i<200; i+=8) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (360 - (200 - 90 - i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 16) == 0) {
			if(i <= 64)
				SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 1);
			else
				SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 11);
			SetLeftHitRoadLast(3, true);
		}
		if((i % 32) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 5);
			SetLeftHitRoadLast(3, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (360 - (200 - 90 - 200)) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<7; i++) {
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 5);
			SetLeftHitRoadLast(3, true);
			SetRightHitRoadLast(3, true);
		}
	}
	for(i=0; i<8; i++)
		SetRoadLast(3, RoadWork[0], RoadWork[1] + 150, RoadWork[2], 2);

	for(i=0; i<8; i++)
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 0);

	JS2D.Vertex_Multiply([0, 0, 47, 1, -750, 0, 0, 1, 750, 0, 0, 1, -1500, 0, 0, 1, 1500, 0, 0, 1], Matrix0, RoadWork, 0, 0, 5);
	SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 0);

	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<8; i++)
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 0);

	for(i=0; i<8; i++)
		SetRoadLast(3, RoadWork[0], RoadWork[1] - 150, RoadWork[2], 2);

	for(i=0; i<7; i++) {
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 5);
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(3, true);
			SetRightHitRoadLast(3, true);
		}
	}

	for(i=0; i<200; i+=8) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + (360- i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 16) == 0) {
			if(i <= 64)
				SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 0);
			else
				SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 11);
			SetRightHitRoadLast(3, true);
		}
		if((i % 32) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 5);
			SetLeftHitRoadLast(3, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + (360 - 200)) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<12; i++) {
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 5);
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(3, true);
			SetRightHitRoadLast(3, true);
		}
	}

	for(i=0; i<90; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + (360 - 200 - i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 0);
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 5);
			SetLeftHitRoadLast(3, true);
			SetRightHitRoadLast(3, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + (360 - 200 - 90)) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<15; i++) {
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(3, true);
			SetRightHitRoadLast(3, true);
		}
	}

	for(i=0; i<200; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + (360 - 200 - 90 + i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(3, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(3, RoadWork[8], 0, RoadWork[10], 11);
			SetRightHitRoadLast(3, true);
			if(i <= 80) {
				SetXnZRoadObjectLastRoadLast(3, RoadWork[4], 0, RoadWork[6], 1);
				SetLeftHitRoadLast(3, true);
			} else
				SetXnZRoadObjectLastRoadLast(3, RoadWork[12], 0, RoadWork[14], 4);
		}
	}


	/**** COURSE 4 ****/
	Roads[4].startindex = 0;
	Roads[4].mapdrawx = 240;
	Roads[4].mapdrawy = 40;
	Roads[4].mapx = 298;
	Roads[4].mapy = 44;

	SetRoad(4, 0, 0, 480, 0, 1);

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 270 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 7);
	for(i=0; i<41; i++) {
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 8) == 0)
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 13);
	}

	SetRoadObjectLastRoadNo(4, 0, 0, 320, 0, 6);
	SetXnZRoadObjectLastRoadNo(4, 0, RoadWork[20], 0, RoadWork[22], 3);
	SetXnZRoadObjectLastRoadNo(4, 0, RoadWork[24], 0, RoadWork[26], 3);

	for(i=0; i<220; i+=5.5) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360 - i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(4, RoadWork[0], RoadWork[1] - 12, RoadWork[2], 2);
		if(i > 44 && (i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 13);
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 13);
		}
		if((i % 4) == 2)
			SetXnZRoadObjectLastRoadLast(4, RoadWork[16], 0, RoadWork[18], 13);
	}

	for(i=0; i<90; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360- 220) + i) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 1);
			SetLeftHitRoadLast(4, true);
		}
		if((i % 40) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
			SetRightHitRoadLast(4, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360 - 220) + 90) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<15; i++) {
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(4, true);
			SetRightHitRoadLast(4, true);
		}
	}

	for(i=0; i<180; i+=12) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360 - 220) + 90 + (360 - i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 24) == 0) {
			if(i < 90)
				SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 0);
			else
				SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
			SetRightHitRoadLast(4, true);
		}
		if((i % 48) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(4, RoadWork[16], 0, RoadWork[18], 13);
			SetLeftHitRoadLast(4, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360 - 220) + 90 + (360 - 180)) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<20; i++) {
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(4, true);
			SetRightHitRoadLast(4, true);
		}
	}

	for(i=0; i<80; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360 - 220) + 90 + (360 - 180) + (360 - i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 20) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 0);
			SetRightHitRoadLast(4, true);
		}
		if((i % 40) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 11);
			SetLeftHitRoadLast(4, true);
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360 - 220) + 90 + (360 - 180) + (360 - 80)) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<4; i++) {
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(4, true);
			SetRightHitRoadLast(4, true);
		}
	}

	for(i=0; i<210; i+=10.83) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (270 + (360 - 220) + 90 + (360 - 180) + (360 - 80) + i) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if(i < 90) {
			if((Math.floor(i) % 2) == 0) {
				SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 1);
				SetLeftHitRoadLast(4, true);
			}
			if((Math.floor(i) % 4) == 0) {
				SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
				SetRightHitRoadLast(4, true);
			}
		}
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 90 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<12; i++) {
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if((i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(4, true);
			SetRightHitRoadLast(4, true);
		}
	}

	for(i=0; i<40; i+=10) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + i) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 1);
		SetLeftHitRoadLast(4, true);
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + 40) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<20; i++) {
		SetRoadLast(4, RoadWork[0], RoadWork[1], RoadWork[2], 1);
		if(i > 4 && (i % 4) == 0) {
			SetXnZRoadObjectLastRoadLast(4, RoadWork[4], 0, RoadWork[6], 11);
			SetXnZRoadObjectLastRoadLast(4, RoadWork[8], 0, RoadWork[10], 11);
			SetLeftHitRoadLast(4, true);
			SetRightHitRoadLast(4, true);
		}
	}

	for(i=0; i<220; i+=7.125) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (90 + 40 + (360 - i)) / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(4, RoadWork[0], RoadWork[1] + 15.5, RoadWork[2], 2);
		if((Math.floor(i) % 4) == 0)
			SetXnZRoadObjectLastRoadLast(4, RoadWork[16], 0, RoadWork[18], 13);
	}


	/**** COURSE 5 ****/
	Roads[5].startindex = 220;
	Roads[5].mapdrawx = 272;
	Roads[5].mapdrawy = 40;
	Roads[5].mapx = 284;
	Roads[5].mapy = 130;

	SetRoad(5, 0, 0, 0, 0, 1);

	for(i=0; i<60; i++) {
		JS2D.SetMatrixRotationX(Matrix0, Math.PI * 2 * 340 / 360);
		JS2D.SetMatrixRotationY(Matrix1, Math.PI * 2 * (180 + i * 15) / 360);
		JS2D.Matrix_Multiply(Matrix0, Matrix1, Matrix2);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix2, RoadWork, 0, 0, 5);
		SetRoadLast(5, RoadWork[0], RoadWork[1], RoadWork[2], 2);
	}

	for(i=0; i<27; i++) {
		JS2D.SetMatrixRotationX(Matrix0, Math.PI * 2 * 340 / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(5, RoadWork[0], RoadWork[1], RoadWork[2], 2);
	}

	for(i=0; i<20; i++) {
		JS2D.SetMatrixRotationX(Matrix0, Math.PI * 2 * 60 / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(5, RoadWork[0], RoadWork[1], RoadWork[2], 0);
	}

	for(i=0; i<37; i++) {
		JS2D.SetMatrixRotationX(Matrix0, Math.PI * 2 * 20 / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(5, RoadWork[0], RoadWork[1], RoadWork[2], 2);
	}
	Roads[5].data[(Roads[5].count - 1) * 4 + 1] = 0;

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * 0 / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<10; i++)
		SetRoadLast(5, RoadWork[0], RoadWork[1], RoadWork[2], 1);

	for(i=0; i<18; i++) {
		JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * i * 10 / 360);
		JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
		SetRoadLast(5, RoadWork[0], RoadWork[1], RoadWork[2], 1);
	}

	JS2D.SetMatrixRotationY(Matrix0, Math.PI * 2 * (180 + 3) / 360);
	JS2D.Vertex_Multiply(RoadTemplate, Matrix0, RoadWork, 0, 0, 5);
	for(i=0; i<79; i++)
		SetRoadLast(5, RoadWork[0], RoadWork[1], RoadWork[2], 1);

	SetRoadObjectLastRoadNo(5, 220, 0, 320, 0, 6);
	SetXnZRoadObjectLastRoadNo(5, 220, -640, 0, 0, 3);
	SetXnZRoadObjectLastRoadNo(5, 220, 640, 0, 0, 3);
}


function SetRoad(road, no, x, y, z, type) {
	Roads[road].data.push(x);
	Roads[road].data.push(y);
	Roads[road].data.push(z);
	Roads[road].data.push(1);
	Roads[road].no.push({type: type, lefthit: false, righthit: false});
	Roads[road].count++;
}


function SetRoadLast(road, x, y, z, type) {
	SetRoad(road, Roads[road].count,
		Roads[road].data[(Roads[road].count - 1) * 4] + x,
		Roads[road].data[(Roads[road].count - 1) * 4 + 1] + y,
		Roads[road].data[(Roads[road].count - 1) * 4 + 2] + z,
		type);
}


function SetLeftHitRoadLast(road, hitflag) {
	Roads[road].no[(Roads[road].count - 1)].lefthit = hitflag;
}


function SetRightHitRoadLast(road, hitflag) {
	Roads[road].no[(Roads[road].count - 1)].righthit = hitflag;
}


function SetRoadObject(road, no, x, y, z, type) {
	Roads[road].object.push(x);
	Roads[road].object.push(y);
	Roads[road].object.push(z);
	Roads[road].object.push(1);
	Roads[road].objectno.push({type:type, relativeX:0, relativeY:0});
	Roads[road].objectcount++;
}


function SetRoadObjectRelative(road, no, x, y, z, type, relativeX, relativeY) {
	Roads[road].object.push(x);
	Roads[road].object.push(y);
	Roads[road].object.push(z);
	Roads[road].object.push(1);
	Roads[road].objectno.push({type:type, relativeX:relativeX, relativeY:relativeY});
	Roads[road].objectcount++;
}


function SetRoadObjectLast(road, x, y, z, type) {
	SetRoadObject(road, Roads[road].objectcount, x, y, z, type);
}


function SetRoadObjectLastRoadNo(road, roadno, x, y, z, type) {
	SetRoadObject(road, Roads[road].objectcount,
				Roads[road].data[roadno * 4]     + x,
				Roads[road].data[roadno * 4 + 1] + y,
				Roads[road].data[roadno * 4 + 2] + z,
				type);
}


function SetRoadObjectLastRoadNoRelativeY(road, roadno, x, y, z, type) {
	SetRoadObjectRelative(road, Roads[road].objectcount,
				Roads[road].data[roadno * 4]     + x,
				Roads[road].data[roadno * 4 + 1] + y,
				Roads[road].data[roadno * 4 + 2] + z,
				type, 0, Roads[road].data[roadno * 4 + 1] / 8);
}


function SetRoadObjectLastRoadLast(road, x, y, z, type) {
	SetRoadObjectLastRoadNo(road, Roads[road].count - 1, x, y, z, type);
}


function SetXnZRoadObjectLastRoadNo(road, roadno, x, n, z, type) {
	SetRoadObject(road, Roads[road].objectcount,
				Roads[road].data[roadno * 4]     + x,
				n,
				Roads[road].data[roadno * 4 + 2] + z,
				type);
}


function SetXnZRoadObjectLastRoadLast(road, x, n, z, type) {
	SetXnZRoadObjectLastRoadNo(road, Roads[road].count - 1, x, n, z, type);
}


//var DiffData = [ -511.9, 0, 511.9, 0];
var DiffData = [ -255.9, 0, 255.9, 0];
var DiffWork0 = new Array(4);
var DiffWork1 = new Array(4);
function MakeRoadData() {
	for(var i=0; i<Roads[CourseIndex].count; i++) {
		var roadnext = i + 1;
		if(roadnext == Roads[CourseIndex].count)
			roadnext = 0;

		var roadlast = i - 1;
		if(roadlast == -1)
			roadlast = Roads[CourseIndex].count - 1;

		var tmpAcosY = GetRoadAngle(i);
		var tmpAcosX = GetRoadAngleX(i);

		var tmpAcosYLast = GetRoadAngle(roadlast);

		var tmpAcosYDiff = tmpAcosY - tmpAcosYLast;
		if(Math.abs(tmpAcosYDiff) > Math.PI) {
			if(tmpAcosY > tmpAcosYLast) {
				tmpAcosYDiff = tmpAcosY - (Math.PI * 2 + tmpAcosYLast);
			} else {
				tmpAcosYDiff = (Math.PI * 2 + tmpAcosY) - tmpAcosYLast;
			}
		}

		RoadData[i].AcosY = tmpAcosY;
		RoadData[i].AcosX = tmpAcosX;
		RoadData[i].AcosYLast = tmpAcosYLast;
		RoadData[i].AcosYDiff = tmpAcosYDiff;

		var tmpDiffNext = GetRoadAngle(roadnext);
		var tmpDiffNow = GetRoadAngle(i);
		JS2D.Rotation2d(DiffData, DiffWork1, tmpDiffNext, 1.0, Roads[CourseIndex].data[roadnext * 4], Roads[CourseIndex].data[roadnext * 4 + 2], 2);
		JS2D.Rotation2d(DiffData, DiffWork0, tmpDiffNow, 1.0, Roads[CourseIndex].data[i * 4], Roads[CourseIndex].data[i * 4 + 2], 2);
		RoadData[i].DiffLeft = JS2D.GetVector(DiffWork1[0] - DiffWork0[0], Roads[CourseIndex].data[roadnext * 4 + 1] - Roads[CourseIndex].data[i * 4 + 1], DiffWork1[1] - DiffWork0[1]);
		RoadData[i].DiffRight = JS2D.GetVector(DiffWork1[2] - DiffWork0[2], Roads[CourseIndex].data[roadnext * 4 + 1] - Roads[CourseIndex].data[i * 4 + 1], DiffWork1[3] - DiffWork0[3]);
		RoadData[i].DiffX = Roads[CourseIndex].data[roadnext * 4]     - Roads[CourseIndex].data[i * 4];
		RoadData[i].DiffY = Roads[CourseIndex].data[roadnext * 4 + 1] - Roads[CourseIndex].data[i * 4 + 1];
		RoadData[i].DiffZ = Roads[CourseIndex].data[roadnext * 4 + 2] - Roads[CourseIndex].data[i * 4 + 2];

	}
}


function GetRoadAngle(i) {
	var roadnext = i + 1;
	if(roadnext == Roads[CourseIndex].count)
		roadnext = 0;

	if(i == -1)
		i = Roads[CourseIndex].count - 1;

	var tmpx = Roads[CourseIndex].data[roadnext * 4]     - Roads[CourseIndex].data[i * 4];
	var tmpz = Roads[CourseIndex].data[roadnext * 4 + 2] - Roads[CourseIndex].data[i * 4 + 2];
	var tmpAcosY = Math.acos(JS2D.ScalarProduct(0, 0, tmpz, tmpx, 0, tmpz));
	if(isNaN(tmpAcosY))
		tmpAcosY = Math.PI / 2;
	if(tmpz < 0)
		tmpAcosY = Math.PI - tmpAcosY;
	if(tmpx > 0)
		tmpAcosY = Math.PI * 2 - tmpAcosY;

	return tmpAcosY;
}


function GetRoadAngleX(i) {
	var roadnext = i + 1;
	if(roadnext == Roads[CourseIndex].count)
		roadnext = 0;

	if(i == -1)
		i = Roads[CourseIndex].count - 1;

	var tmpx = Roads[CourseIndex].data[roadnext * 4]     - Roads[CourseIndex].data[i * 4];
	var tmpy = Roads[CourseIndex].data[roadnext * 4 + 1] - Roads[CourseIndex].data[i * 4 + 1];
	var tmpz = Roads[CourseIndex].data[roadnext * 4 + 2] - Roads[CourseIndex].data[i * 4 + 2];
	var tmpAcosX = Math.acos(JS2D.ScalarProduct(tmpx, 0, tmpz, tmpx, tmpy, tmpz));
	if(isNaN(tmpAcosX))
		tmpAcosX = 0.0;
	if(tmpy > 0)
		tmpAcosX = Math.PI * 2 - tmpAcosX;

	return tmpAcosX;
}


var CarCharacter = 
[{accelerate: 0.4,  breaking: 1.0, maxspeed: 92, handling: 128, grip: 20},

 {accelerate: 2.25, breaking: 4.0, maxspeed: 90, handling: 128, grip: 25},
 {accelerate: 1.6,  breaking: 2.0, maxspeed: 88, handling:  48, grip: 27},

 {accelerate: 0.5,  breaking: 4.0, maxspeed: 80, handling:   8, grip: 30},
 {accelerate: 2.0,  breaking: 2.0, maxspeed: 91, handling: 176, grip: 17},

 {accelerate: 1.25, breaking: 4.0, maxspeed: 88, handling: 128, grip: 25},

 {accelerate: 1.0,  breaking: 6.0, maxspeed: 85, handling: 128, grip: 25},
 {accelerate: 3.0,  breaking: 4.0, maxspeed: 82, handling: 128, grip: 25}];


function CarMoveSub(CarIndex, flag) {
	Cars[CarIndex].lastindex = Cars[CarIndex].index;

	var RoadIndex = Cars[CarIndex].index;
	var RoadIndexDetails = Cars[CarIndex].details;
	var MyCarStatus = Cars[CarIndex].status;
	var MyCarSpeed = Cars[CarIndex].speed;
	var MyCarUpDown = Cars[CarIndex].updown;
	var MyCarY = Cars[CarIndex].ey;
	var MyCarSpeedTmp = Cars[CarIndex].jumpz;
	var MyCarX = Cars[CarIndex].x;
	var MyCarRotFlag = Cars[CarIndex].rflag;
	var MyCarZ = Cars[CarIndex].displayz;
	var MyCarRotZ = Cars[CarIndex].rz;

	var roadnext = (RoadIndex + 1) % Roads[CourseIndex].count;
	var roadlast = (Roads[CourseIndex].count + RoadIndex - 1) % Roads[CourseIndex].count;

	if(MyCarStatus == 0 && Roads[CourseIndex].no[roadnext].type == 0) {
		MyCarStatus = 2;
		MyCarY = Roads[CourseIndex].data[RoadIndex * 4 + 1];
		MyCarUpDown = 0;

		DiffWork0[0] = MyCarSpeed;
		DiffWork0[1] = 0;
		JS2D.Rotation2d(DiffWork0, DiffWork1, RoadData[roadlast].AcosX, 1.0, 0, 0, 1);

		MyCarSpeedTmp = DiffWork1[0];
		MyCarUpDown = -DiffWork1[1];
	}

	if(MyCarStatus == 2 && Roads[CourseIndex].no[RoadIndex].type != 0 && Roads[CourseIndex].no[roadnext].type != 0 && MyCarY <= Roads[CourseIndex].data[RoadIndex * 4 + 1] + 8.0)
		MyCarStatus = 0;

	var tmpAcosYDiff = RoadData[RoadIndex].AcosYDiff;

	var tmpKeyX = 0;
	var LeftKey = false;
	var RightKey = false;
	var AccelKey = false;
	var BrakeKey = false;

	if(MyCarStatus == 0) {
		if(CarIndex == 0 && flag == true) {
			if(KeyStatus[0] == 1)
				AccelKey = true;
			if(KeyStatus[1] == 1)
				BrakeKey = true;

			if(KeyStatus[5] == 1) {
				RightKey = true;
				if(EyeRotationZ > -10)
					EyeRotationZ -= 0.5;
			}
			if(KeyStatus[4] == 1) {
				LeftKey = true;
				if(EyeRotationZ < 10)
					EyeRotationZ += 0.5;
			}

			if(KeyStatus[4] == 0 && KeyStatus[5] == 0) {
				if(EyeRotationZ < 0)
					EyeRotationZ += 0.5;
				if(EyeRotationZ > 0)
					EyeRotationZ -= 0.5;
			}
		} else {
			if(MyCarX < -CarCharacter[CarIndex].handling) {
				RightKey = true;
				if(Cars[CarIndex].display == 1)
					BrakeKey = true;
			}
			if(MyCarX > CarCharacter[CarIndex].handling) {
				LeftKey = true;
				if(Cars[CarIndex].display == 1)
					BrakeKey = true;
			}
			if(BrakeKey != true)
				AccelKey = true;
		}

		if(AccelKey)
			MyCarSpeed += CarCharacter[CarIndex].accelerate;
		if(MyCarSpeed > CarCharacter[CarIndex].maxspeed)
			MyCarSpeed = CarCharacter[CarIndex].maxspeed;
		if(BrakeKey)
			MyCarSpeed -= CarCharacter[CarIndex].breaking;
		if(MyCarSpeed < 0)
			MyCarSpeed = 0;

		if(MyCarX < -503.9 || MyCarX > 503.9) {
			MyCarUpDown++;
			if(MyCarSpeed > 8)
				MyCarSpeed -= 1.0;
		} else {
			MyCarUpDown = 0;
		}

		if(RightKey) {
			tmpKeyX = MyCarSpeed * 2;
			if(tmpKeyX > CarCharacter[CarIndex].grip)
				tmpKeyX = CarCharacter[CarIndex].grip;
		}
		if(LeftKey) {
			tmpKeyX = -MyCarSpeed * 2;
			if(tmpKeyX < -CarCharacter[CarIndex].grip)
				tmpKeyX = -CarCharacter[CarIndex].grip;
		}
	}

	//var tmpCarX = tmpAcosYDiff * MyCarSpeed * 2;
	var tmpCarX = tmpAcosYDiff * MyCarSpeed * 2.5;

	MyCarX += tmpCarX + tmpKeyX;

	if(MyCarX < -511.9 - 96.0)
		MyCarX = -511.9 - 96.0;
	if(MyCarX > 511.9 + 96.0)
		MyCarX = 511.9 + 96.0;

	var DiffVec = (RoadData[RoadIndex].DiffRight - RoadData[RoadIndex].DiffLeft) / 512 * (MyCarX + 256) + RoadData[RoadIndex].DiffLeft;

	var tmpAcosY = tmpAcosYDiff / DiffVec * RoadIndexDetails + RoadData[RoadIndex].AcosYLast;

	var RotationX = RoadData[RoadIndex].DiffX / DiffVec * RoadIndexDetails + Roads[CourseIndex].data[RoadIndex * 4];
	var RotationY = RoadData[RoadIndex].DiffY / DiffVec * RoadIndexDetails + Roads[CourseIndex].data[RoadIndex * 4 + 1];
	var RotationZ = RoadData[RoadIndex].DiffZ / DiffVec * RoadIndexDetails + Roads[CourseIndex].data[RoadIndex * 4 + 2];

	if(MyCarStatus == 2) {
		MyCarUpDown -= 1.5;
		MyCarY += MyCarUpDown;
		RotationY = MyCarY;
	}

	if(MyCarStatus == 1) {
		MyCarSpeed -= 0.5;
		if(MyCarSpeed < 0.0)
			MyCarSpeed = 0.0;

		MyCarY -= 2.0;
		if(MyCarY < 0.0)
			MyCarY = 0.0;

		RotationY = MyCarY;

		//MyCarZ += -MyCarSpeed / 2;
		MyCarZ += -MyCarSpeed / 4;

		MyCarRotZ += MyCarRotFlag * 6;

		if(MyCarRotZ >= 360 || MyCarRotZ <= 0) {
			MyCarStatus = 0;
			MyCarX = 0;
			MyCarZ = 0;
			EyeRotationZ = 0;
			MyCarSpeed = 0.0;

			var tmpNext = roadnext;
			while(Roads[CourseIndex].no[RoadIndex].type == 0 || Roads[CourseIndex].no[tmpNext].type == 0) {
				RoadIndex = ++RoadIndex % Roads[CourseIndex].count;
				tmpNext = ++tmpNext % Roads[CourseIndex].count;
			}
		}
	}

	var tmpAcosX;
	if(MyCarStatus == 2) {
		var tmp = Math.acos(JS2D.ScalarProduct(0, 0, MyCarSpeedTmp, 0, MyCarUpDown, MyCarSpeedTmp));
		if(isNaN(tmp))
			tmp = 0;
		if(MyCarUpDown > 0)
			tmpAcosX = Math.PI * 2 - tmp;
		else
			tmpAcosX = tmp;
	} else {
		tmpAcosX = RoadData[RoadIndex].AcosX;
	}

	if((MyCarStatus == 0 && (MyCarX < -511.9 - 32.0 || MyCarX > 511.9 + 32.0) && RotationY > 16.0) ||
	   (MyCarStatus == 0 && ((MyCarX < -511.9 - 32.0 && Roads[CourseIndex].no[RoadIndex].lefthit) || (MyCarX > 511.9 + 32.0  && Roads[CourseIndex].no[RoadIndex].righthit))) ||
	   (MyCarStatus == 2 && RotationY < Roads[CourseIndex].data[RoadIndex * 4 + 1] - 128.0)) {

		MyCarStatus = 1;
		MyCarY = RotationY;

		if(MyCarX < -511.9 - 32.0) {
			MyCarRotZ = 360;
			MyCarRotFlag = -1;
			MyCarZ = 0;
		} else {
			MyCarRotZ = 0;
			MyCarRotFlag = 1;
			MyCarZ = 0;
		}
	}

	if((tmpKeyX < 0 && (tmpCarX + tmpKeyX) > 0) || (tmpKeyX > 0 && (tmpCarX + tmpKeyX) < 0))
		Cars[CarIndex].display = 1;
	else
		Cars[CarIndex].display = 0;

	var tmpCarSpeed = 0;
	if(MyCarStatus == 2) {
		tmpCarSpeed = MyCarSpeedTmp;
	} else {
		tmpCarSpeed = MyCarSpeed;
	}

	EnemyTmp[0] = MyCarX;
	EnemyTmp[1] = 0;
	JS2D.Rotation2d(EnemyTmp, DiffWork0, GetRoadAngle(RoadIndex), 1.0, RotationX, RotationZ, 1);

	Cars[CarIndex].wx = DiffWork0[0];
	Cars[CarIndex].wy = RotationY;
	Cars[CarIndex].wz = DiffWork0[1];

	Cars[CarIndex].status = MyCarStatus;
	Cars[CarIndex].speed = MyCarSpeed;
	Cars[CarIndex].updown = MyCarUpDown;
	Cars[CarIndex].ex = RotationX;
	Cars[CarIndex].ey = RotationY;
	Cars[CarIndex].ez = RotationZ;
	Cars[CarIndex].jumpz = MyCarSpeedTmp;
	Cars[CarIndex].x = MyCarX;
	Cars[CarIndex].rx = tmpAcosX;
	Cars[CarIndex].ry = tmpAcosY;
	Cars[CarIndex].rz = MyCarRotZ;
	Cars[CarIndex].rflag = MyCarRotFlag;
	Cars[CarIndex].displayz = MyCarZ;
	if((RoadIndexDetails += tmpCarSpeed) >= DiffVec) {
		Cars[CarIndex].mileage++;
		RoadIndexDetails -= DiffVec;
		if(++RoadIndex == Roads[CourseIndex].count)
			RoadIndex = 0;
	}
	Cars[CarIndex].index = RoadIndex;
	Cars[CarIndex].details = RoadIndexDetails;
}


function CarMove(index, flag) {
	var CarIndex;
	for(CarIndex = index; CarIndex < CarsCount; CarIndex++)
		CarMoveSub(CarIndex, flag);
}


var RotationX;
var RotationY;
var RotationZ;
var tmpAcosY;
var EyeX;
var Order = new Array(CarsCount);
function PdMove() {

	JS2D.Init2dArray(DrawData);
	SpriteCount = 1;

	switch(PlayStatus) {
		case 1:
			if(KeyStatus[0] != 1 && KeyStatus[1] != 1)
				break;
			CourseIndex = CourseCount - 1;

		case 8:
			if(++CourseIndex == CourseCount)
				CourseIndex = 0;

			MakeRoadData();

			Cars[0].lastindex = Cars[0].index = Roads[CourseIndex].startindex + 1;

			Cars[0].mileage = 1;
			Cars[0].order = CarsCount;
			Cars[0].x = 256;
			Cars[0].ex = Roads[CourseIndex].data[Cars[0].index * 4];
			Cars[0].ey = Roads[CourseIndex].data[Cars[0].index * 4 + 1];
			Cars[0].ez = Roads[CourseIndex].data[Cars[0].index * 4 + 2];
			Cars[0].wy = 128 + 20 * 120;
			//Cars[0].wz = -160 - 200 * 120;
			Cars[0].wz = -256 - 200 * 120;
			Cars[0].ry = RoadData[Cars[0].index].AcosYLast + 0.05 * 120;
			Cars[0].updown = 120 + 30;

			EyeRotationZ = 0;

			for(var i=0; i< CarsCount - 1; i++) {

				Cars[i + 1].details = 0;
				Cars[i + 1].speed = 0;
				Cars[i + 1].status = 0;

				Cars[i + 1].ex = 0;
				Cars[i + 1].ey = 0;
				Cars[i + 1].ez = 0;

				Cars[i + 1].wx = 0;
				Cars[i + 1].wy = 0;
				Cars[i + 1].wz = 0;

				Cars[i + 1].rx = 0;
				Cars[i + 1].ry = 0;
				Cars[i + 1].rz = 0;

				Cars[i + 1].updown = 0;
				Cars[i + 1].jumpz = 0;
				Cars[i + 1].display = 0;
				Cars[i + 1].rflag = 0;
				Cars[i + 1].displayz = 0;
				Cars[i + 1].order = i + 1;

				if((i & 0x01) == 0x00)
					Cars[i + 1].x = -256;
				else
					Cars[i + 1].x = 256;

				Cars[i + 1].mileage = 4 - (i >> 1);
				Cars[i + 1].lastindex = Cars[i + 1].index = Roads[CourseIndex].startindex + Cars[i + 1].mileage;
			}
			CarMove(1, false);

			Cars[CarsCount].index = 15;
			Cars[CarsCount].wx = 160;
			Cars[CarsCount].wy = 80 - 120;
			Cars[CarsCount].wz = 2.0 / 120;

			Cars[CarsCount + 1].index = 16;
			Cars[CarsCount + 1].wx = 80;
			Cars[CarsCount + 1].wy = 128 - 120 * 2;
			Cars[CarsCount + 1].wz = 2.0 / 120;

			EyeRotationX = 0;

			PlayStatus = 9;
			break;


		case 9:
			if(Cars[0].updown > 30) {
				Cars[0].wy -= 20;
				Cars[0].wz += 200;
				Cars[0].ry -= 0.05;

				Cars[CarsCount].wy += 1;
				Cars[CarsCount].wz += 2.0 / 120;

				Cars[CarsCount + 1].wy += 2;
				Cars[CarsCount + 1].wz += 2.0 / 120;
			}

			if(Cars[0].updown == 60)
				Cars[CarsCount + 1].index = 17;

			if(Cars[0].updown == 30)
				Cars[CarsCount + 1].index = 18;

			if(--Cars[0].updown == 0) {
				Cars[0].details = 0;
				Cars[0].speed = 0;
				Cars[0].status = 0;
				Cars[0].x = 256;

				Cars[0].ex = 0;
				Cars[0].ey = 0;
				Cars[0].ez = 0;

				Cars[0].wx = 0;
				Cars[0].wy = 0;
				Cars[0].wz = 0;

				Cars[0].ex = 0;
				Cars[0].ey = 0;
				Cars[0].ez = 0;

				Cars[0].rx = 0;
				Cars[0].ry = 0;
				Cars[0].rz = 0;

				Cars[0].updown = 0;
				Cars[0].jumpz = 0;
				Cars[0].display = 0;
				Cars[0].rflag = 0;
				Cars[0].displayz = 0;

				Cars[CarsCount + 1].index = 19;

				LapCount = 0;

				PlayStatus = 16;
				CarMove(0, true);

				EyeRotationX = Math.PI * 2 - RoadData[Cars[0].index].AcosX;
				if(EyeRotationX > Math.PI)
					EyeRotationX -= Math.PI * 2;

				Cars[CarsCount + 2].index = 28;
				Cars[CarsCount + 2].wx = 240;
				Cars[CarsCount + 2].wy = 192;
				Cars[CarsCount + 2].wz = 4.0
			}
			break;


		case 16:
			CarMove(0, true);

			for(var i = 0; i < CarsCount; i++)
				Order[i] = i;

			Order.sort(function(a, b){
					if(Cars[b].mileage == Cars[a].mileage)
						return Cars[b].details - Cars[a].details;
					else
						return Cars[b].mileage - Cars[a].mileage;});

			for(var i = 0; i < CarsCount; i++)
				Cars[Order[i]].order = i + 1;

			Cars[CarsCount + 2].index = 21 + Cars[0].order;

			if(Cars[0].index == Roads[CourseIndex].startindex && Cars[0].lastindex != Roads[CourseIndex].startindex) {
				if(LapCount == 3) {
					PlayStatus = 32;
					EndCount = 0;
				} else
					LapCount++;
			}
			break;


		case 32:
			CarMove(0, false);

			if(EndCount < 40) {
				Cars[CarsCount + 2].wx -= 2;
				if(EndCount != 0 && (EndCount % 10) == 0) {
					Cars[CarsCount + 2].wy -= 16;
					Cars[CarsCount + 2].wz += 4.0;
				}
			}

			if(++EndCount == 240) {
				EndCount = 0;
				if(Cars[0].order <= 3)
					PlayStatus = 8;
				else
					PlayStatus = 64;
			}
			break;

		case 64:
			if(++EndCount == 240)
				PlayStatus = 1;
			break;
	}

	if(PlayStatus == 1) {
		BGFill(0, 223, 0, 0, 0);
		SetSprite2(20, 160, 112, 0, 0, 1.0, 0, 0);
	} else if(PlayStatus == 64) {
		BGFill(0, 223, 0, 0, 0);
		SetSprite2(33, 160, 112, 0, 0, 1.0, 0, 0);
	} else {
		if(PlayStatus == 9 || PlayStatus == 16) {
			EyeX = Cars[0].x;
			RotationX = Cars[0].ex;
			RotationY = Cars[0].ey;
			RotationZ = Cars[0].ez;
			tmpAcosY = Cars[0].ry;
		}

		var EyeY;
		var EyeZ;
		if(PlayStatus == 9) {
			EyeY = Cars[0].wy;
			EyeZ = Cars[0].wz;
		} else {
			EyeY = 128;
			//EyeZ = -160;
			EyeZ = -256;

			if(PlayStatus == 16) {
				var tmp = Math.PI * 2 - RoadData[Cars[0].index].AcosX;
				if(tmp > Math.PI)
					tmp -= Math.PI * 2;
				EyeRotationX = EyeRotationX * 0.8 + tmp * 0.2;
			}
		}

		JS2D.SetMatrixTranslation(Matrix0, -RotationX, -RotationY, -RotationZ);
		JS2D.SetMatrixRotationY(Matrix1, tmpAcosY);
		JS2D.Matrix_Multiply(Matrix0, Matrix1, Matrix2);
		JS2D.SetMatrixRotationX(Matrix1, EyeRotationX);
		JS2D.Matrix_Multiply(Matrix2, Matrix1, Matrix0);
		JS2D.SetMatrixTranslation(Matrix1, -EyeX, -EyeY, -EyeZ);
		JS2D.Matrix_Multiply(Matrix0, Matrix1, Matrix2);
		JS2D.SetMatrixRotationZ(Matrix1, Math.PI * 2 * (360 - EyeRotationZ) / 360);
		JS2D.Matrix_Multiply(Matrix2, Matrix1, MatrixWorld);

		JS2D.Vertex_Multiply(Roads[CourseIndex].data, MatrixWorld, RoadWork, 0, 0, Roads[CourseIndex].count);
		for(var i=0; i<Roads[CourseIndex].count; i++) {
			if(Roads[CourseIndex].no[i].type != 0)
				DrawObject(RoadAttribute[Roads[CourseIndex].no[i].type].no, RoadWork[i * 4], RoadWork[i * 4 + 1], RoadWork[i * 4 + 2], EyeRotationZ, 2.0);
		}

		if(ObjectFlag) {
			JS2D.Vertex_Multiply(Roads[CourseIndex].object, MatrixWorld, RoadWork, 0, 0, Roads[CourseIndex].objectcount);
			for(var i=0; i<Roads[CourseIndex].objectcount; i++)
				DrawObject3(RoadObjectAttribute[Roads[CourseIndex].objectno[i].type].no,
					    RoadWork[i * 4], RoadWork[i * 4 + 1], RoadWork[i * 4 + 2], EyeRotationZ, 2.0,
					    Roads[CourseIndex].objectno[i].relativeX, Roads[CourseIndex].objectno[i].relativeY);

		}

		if(PlayStatus == 9 && Cars[0].updown <= 30) {
			DrawObject2(1, 0, 0, 0, 0, 0.6);
		}

		if(PlayStatus == 16) {
			var MyCarStatus = Cars[0].status;
			var MyCarUpDown = Cars[0].updown;
			var MyCarRotZ = Cars[0].rz;
			var MyCarZ = Cars[0].displayz;
			var tmpCarY = 0;
			var tmpCarRotZ = 0;
			if(MyCarStatus == 0) {
				tmpCarY = (MyCarUpDown & 0x02) * 4;
				tmpCarRotZ = EyeRotationZ;
			}

			if(MyCarStatus == 2) {
				tmpCarRotZ = EyeRotationZ;
			}

			if(MyCarStatus == 1) {
				tmpCarRotZ = MyCarRotZ;
			}

			if(Cars[0].display == 1)
				DrawObject2(2, 0, tmpCarY, MyCarZ, tmpCarRotZ, 0.6);
			else
				DrawObject2(1, 0, tmpCarY, MyCarZ, tmpCarRotZ, 0.6);


			if(Cars[CarsCount].wy > -8) {
				Cars[CarsCount].wy -= 1 * 2;
				Cars[CarsCount].wz -= 2.0 / 120 * 2;
			}

			if(Cars[CarsCount + 1].wy > -8) {
				Cars[CarsCount + 1].wy -= 2 * 2;
				Cars[CarsCount + 1].wz -= 2.0 / 120 * 2;
			}

		}

		SetSprite2(Cars[CarsCount].index, Cars[CarsCount].wx, Cars[CarsCount].wy, 0, 0, Cars[CarsCount].wz, 0, 0);
		SetSprite2(Cars[CarsCount + 1].index, Cars[CarsCount + 1].wx, Cars[CarsCount + 1].wy, 0, 0, Cars[CarsCount + 1].wz, 0, 0);

		if(PlayStatus == 16 || PlayStatus == 32) {
			SetSprite2(Cars[CarsCount + 2].index, Cars[CarsCount + 2].wx, Cars[CarsCount + 2].wy, 0, 0, Cars[CarsCount + 2].wz, 0, 0);
			SetSprite2(31, 276, 204, 0, 0, 1.0, 0, 0);
			SetSprite2(22 + LapCount, 296, 200, 0, 0, 2.0, 0, 0);

			for(var i=0; i<8; i++) {
				if(i == 0) {
					SetSprite2(39, Cars[0].wx / 256 + Roads[CourseIndex].mapx, Roads[CourseIndex].mapy - Cars[0].wz / 256, 0.1, 360 - Cars[0].ry * 180 / Math.PI, 1.0, 0, 0);
				} else {
					SetSprite2(21 + Cars[i].order, Cars[i].wx / 256 + Roads[CourseIndex].mapx, Roads[CourseIndex].mapy - Cars[i].wz / 256, Cars[i].order / 10 + 0.2, 0, 1.0, 0, 0);
				}
			}
		}

		SetSprite2(40 + CourseIndex, Roads[CourseIndex].mapdrawx, Roads[CourseIndex].mapdrawy, 1.1, 0, 1.0, 0, 0);

		if(PlayStatus == 32)
			EnemyDraw(0);
		else
			EnemyDraw(1);

		var hline = Math.sin(EyeRotationX) * 160 + 112;

		tmpAcosY %= Math.PI * 2;
		var hr = tmpAcosY / (Math.PI * 2) * 640 - 160;
		if(hr < -160)
			hr += 320;
		if(hr > 160)
			hr -= 320;
		SetSprite2(7, 160, hline, 65535, EyeRotationZ, 1.0, hr, 0);

		BGFill(    0, hline - 1,   0, 183, 239);
		BGFill(hline,       223, 157, 187,  97);
	}

	JS2D.Draw2dArray(DrawData);
	JS2D.PutImage();
}


function BGFill(y0, y1, r, g, b) {

	if(y0 > y1 || y1 < 0 || y0 >= JS2D.ScreenHeight)
		return;

	if(y0 < 0)
		y0 = 0;
	if(y1 >= JS2D.ScreenHeight)
		y1 = JS2D.ScreenHeight - 1;

	y0 = (y0 | 0) * JS2D.ScreenWidth * 4;
	y1 = ((y1 | 0) + 1) * JS2D.ScreenWidth * 4;
	var data = JS2D.ImageData.data;

	for(var i=y0; i<y1; i+=4) {
		data[i] = r;
		data[i + 1] = g;
		data[i + 2] = b;
	}
}


var SpriteData = [
//No. 00 ROAD1
[ -63.9,  -7.9,
   63.9,  23.9,
    0.0,   0.0,
  127.9,  31.9],

//No. 01 MYCAR
[ -31.9, -15.9,
   31.9,  15.9,
  128.0,   0.0,
  191.9,  31.9],

//No. 02 MYCAR
[ -31.9, -15.9,
   31.9,  15.9,
  128.0,  32.0,
  191.9,  63.9],

//No. 03 LEFT
[ -35.9, -47.9,
   35.9,   0.0,
  192.0,   0.0,
  239.9,  31.9],

//No. 04 RIGHT
[ -35.9, -47.9,
   35.9,   0.0,
  239.9,   0.0,
  192.0,  31.9],

//No. 05 HOUSE
[ -47.9, -63.9,
   47.9,   0.0,
  192.0,  128.0,
  239.9,  159.9],

//No. 06 WOOD
[ -15.9,-223.9,
   15.9,   0.0,
  256.0,   0.0,
  271.9, 111.9],

//No. 07 HORIZON
[-319.9, -31.9,
  319.9,  31.9,
    0.0, 208.0,
  159.9, 223.9],

//No. 08 IRON FRAME
[ -23.9,-223.9,
   23.9,   0.0,
  272.0,   0.0,
  287.9, 111.9],

//No. 09 ROCK
[ -47.9,-127.9,
   47.9,   0.0,
  192.0,  64.0,
  239.9, 127.9],

//No. 10 COLA
[ -35.9, -47.9,
   35.9,   0.0,
  192.0,  32.0,
  239.9,  63.9],

//No. 11 ENEMY
[ -31.9, -15.9,
   31.9,  15.9,
  128.0,  64.0,
  191.9,  95.9],

//No. 12 ROAD2
[ -63.9,  -7.9,
   63.9,  23.9,
    0.0,  32.0,
  127.9,  63.9],

//No. 13 ENEMY2
[ -31.9, -15.9,
   31.9,  15.9,
  128.0,  96.0,
  191.9, 127.9],

//No. 14 START
[ -95.9, -15.9,
   95.9,  15.9,
    0.0,  64.0,
  127.9,  95.9],

//No. 15 FLY START
[ -63.9, -15.9,
   63.9,  15.9,
    0.0,  96.0,
  127.9, 127.9],

//No. 16 FLY START 3
[ -31.9,  -7.9,
   31.9,   7.9,
    0.0, 128.0,
   63.9, 143.9],

//No. 17 FLY START 2
[ -31.9,  -7.9,
   31.9,   7.9,
   64.0, 128.0,
  127.9, 143.9],

//No. 18 FLY START 1
[ -31.9,  -7.9,
   31.9,   7.9,
    0.0, 144.0,
   63.9, 159.9],

//No. 19 FLY START 0
[ -31.9,  -7.9,
   31.9,   7.9,
   64.0, 144.0,
  127.9, 159.9],

//No. 20 PRESS KEY
[ -63.9,  -7.9,
   63.9,   7.9,
    0.0, 192.0,
  127.9, 207.9],

//No. 21 0
[  -3.9,  -3.9,
    3.9,   3.9,
  160.0, 216.0,
  167.9, 223.9],

//No. 22 1
[  -3.9,  -3.9,
    3.9,   3.9,
  168.0, 216.0,
  175.9, 223.9],

//No. 23 2
[  -3.9,  -3.9,
    3.9,   3.9,
  176.0, 216.0,
  183.9, 223.9],

//No. 24 3
[  -3.9,  -3.9,
    3.9,   3.9,
  184.0, 216.0,
  191.9, 223.9],

//No. 25 4
[  -3.9,  -3.9,
    3.9,   3.9,
  192.0, 216.0,
  199.9, 223.9],

//No. 26 5
[  -3.9,  -3.9,
    3.9,   3.9,
  200.0, 216.0,
  207.9, 223.9],

//No. 27 6
[  -3.9,  -3.9,
    3.9,   3.9,
  208.0, 216.0,
  215.9, 223.9],

//No. 28 7
[  -3.9,  -3.9,
    3.9,   3.9,
  216.0, 216.0,
  223.9, 223.9],

//No. 29 8
[  -3.9,  -3.9,
    3.9,   3.9,
  224.0, 216.0,
  231.9, 223.9],

//No. 30 9
[  -3.9,  -3.9,
    3.9,   3.9,
  232.0, 216.0,
  239.9, 223.9],

//No. 31 LAP
[ -11.9,  -3.9,
   11.9,   3.9,
  160.0, 208.0,
  183.9, 215.9],

//No. 32 IRON FRAME
[ -63.9, -15.9,
   63.9,  15.9,
   64.0, 160.0,
  127.9, 175.9],

//No. 33 GAME OVER
[ -63.9,  -7.9,
   63.9,   7.9,
  128.0, 192.0,
  255.9, 207.9],

//No. 34 ROCK
[ -95.9, -23.9,
   95.9,  23.9,
    0.0, 160.0,
   63.9, 175.9],

//No. 35 LONG IRON FRAME
//[ -23.9,-895.9,
[ -23.9,-1023.9,
   23.9,   0.0,
  304.0,   0.0,
  319.9, 223.9],

//No. 36 LOW WOOD
[ -47.9, -63.9,
   47.9,   0.0,
  192.0, 160.0,
  239.9, 191.9],

//No. 37 WOOD2
[ -47.9,-191.9,
   47.9,   0.0,
  128.0, 128.0,
  159.9, 191.9],

//No. 38 TOWER
[ -31.9,-223.9,
   31.9,   0.0,
  240.0,   0.0,
  255.9, 111.9],

//No. 39 SMALLMYCAR
[  -3.9,  -7.9,
    3.9,   7.9,
  240.1, 208.1,
  247.9, 223.9],

//No. 40 MAP0
[   0.0,   0.0,
   36.9, 116.9,
  320.0,   0.0,
  356.9, 116.9],

//No. 41 MAP1
[   0.0,   0.0,
   51.9, 119.9,
  357.0,   0.0,
  408.9, 119.9],

//No. 42 MAP2
[   0.0,   0.0,
   77.9,  57.9,
  409.0,   0.0,
  486.9,  57.9],

//No. 43 MAP3
[   0.0,   0.0,
   68.9,  47.9,
  487.0,   0.0,
  555.9,  47.9],

//No. 44 MAP4
[   0.0,   0.0,
   69.9,  41.9,
  556.0,   0.0,
  625.9,  41.9],

//No. 45 MAP5
[   0.0,   0.0,
   19.9,  98.9,
  320.0, 121.0,
  339.9, 219.9]];



function DrawObject(no, x, y, z, r, m) {
	if(z >= 0) {
	//if(z >= 0 && z <= 8192) {
		tmpz = 160 / (z + 1);
		x = (x * tmpz) + 160;
		y = 112 - (y * tmpz);
		m = tmpz * m * 4;
		SetSprite2(no, x, y, z, r, m, 0, 0);
	}
}


function DrawObject2(no, x, y, z, r, m) {
	z += 160;
	if(z >= 0) {
	//if(z >= 0 && z <= 16384) {
		tmpz = 160 / (z + 1);
		m = tmpz * m * 4;
		SetSprite2(no, 160, 184 + y, z, r, m, 0, 0);
	}
}



function DrawObject3(no, x, y, z, r, m, relx, rely) {
	if(z >= 0) {
	//if(z >= 0 && z <= 8192) {
		tmpz = 160 / (z + 1);
		x = (x * tmpz) + 160;
		y = 112 - (y * tmpz);
		m =tmpz * m * 4;
		SetSprite2(no, x, y, z, r, m, relx, rely);
	}
}



var RotationData = new Array(8);
var RotationWork = new Array(8);

function SetSprite2(no, x, y, z, r, m, tx, ty) {
	RotationData[0] = SpriteData[no][0] + tx;
	RotationData[1] = SpriteData[no][1] + ty;
	RotationData[2] = SpriteData[no][0] + tx;
	RotationData[3] = SpriteData[no][3] + ty;
	RotationData[4] = SpriteData[no][2] + tx;
	RotationData[5] = SpriteData[no][3] + ty;
	RotationData[6] = SpriteData[no][2] + tx;
	RotationData[7] = SpriteData[no][1] + ty;

	JS2D.Rotation2d(RotationData, RotationWork, Math.PI * 2 * r / 360, m, x, y, 4);

	DrawData[SpriteCount].zindex = z;
	DrawData[SpriteCount].count = 4;

	DrawData[SpriteCount].data[0].x = RotationWork[0];
	DrawData[SpriteCount].data[0].y = RotationWork[1];
	DrawData[SpriteCount].data[0].tx = SpriteData[no][4];
	DrawData[SpriteCount].data[0].ty = SpriteData[no][5];

	DrawData[SpriteCount].data[1].x = RotationWork[2];
	DrawData[SpriteCount].data[1].y = RotationWork[3];
	DrawData[SpriteCount].data[1].tx = SpriteData[no][4];
	DrawData[SpriteCount].data[1].ty = SpriteData[no][7];

	DrawData[SpriteCount].data[2].x = RotationWork[4];
	DrawData[SpriteCount].data[2].y = RotationWork[5];
	DrawData[SpriteCount].data[2].tx = SpriteData[no][6];
	DrawData[SpriteCount].data[2].ty = SpriteData[no][7];

	DrawData[SpriteCount].data[3].x = RotationWork[6];
	DrawData[SpriteCount].data[3].y = RotationWork[7];
	DrawData[SpriteCount].data[3].tx = SpriteData[no][6];
	DrawData[SpriteCount].data[3].ty = SpriteData[no][5];
	SpriteCount++;
}



var KeyStatus = [ 0, 0, 0, 0, 0, 0];
function KeyUpFunc (evt){
	switch (evt.keyCode){
		case 88:// A
			KeyStatus[0] = 0x00;
			break;
		case 90:// B
			KeyStatus[1] = 0x00;
			break;
		case 38:// UP
			KeyStatus[2] = 0x00;
			break;
		case 40:// DOWN
			KeyStatus[3] = 0x00;
			break;
		case 37:// LEFT
			KeyStatus[4] = 0x00;
			break;
		case 39:// RIGHT
			KeyStatus[5] = 0x00;
			break;
	}
	evt.stopPropagation();
	evt.preventDefault();
}


function KeyDownFunc (evt){
	switch (evt.keyCode){
		case 88:// A
			KeyStatus[0] = 0x01;
			break;
		case 90:// B
			KeyStatus[1] = 0x01;
			break;
		case 38:// UP
			KeyStatus[2] = 0x01;
			break;
		case 40:// DOWN
			KeyStatus[3] = 0x01;
			break;
		case 37:// LEFT
			KeyStatus[4] = 0x01;
			break;
		case 39:// RIGHT
			KeyStatus[5] = 0x01;
			break;
	}
	evt.stopPropagation();
	evt.preventDefault();
}


var EnemyTmp = new Array(1 * 4);
function EnemyDraw(index) {

	var CarIndex;
	for(CarIndex = index; CarIndex < CarsCount; CarIndex++) {
		EnemyTmp[0] = Cars[CarIndex].wx;
		EnemyTmp[1] = Cars[CarIndex].wy + 40;
		EnemyTmp[2] = Cars[CarIndex].wz;
		EnemyTmp[3] = 1;
		JS2D.Vertex_Multiply(EnemyTmp, MatrixWorld, RoadWork, 0, 0, 1);

		var tmpCarY = 0;
		var tmpCarRotZ = 0;
		if(Cars[CarIndex].status == 0) {
			tmpCarY = (Cars[CarIndex].updown & 0x02) * 4;
			tmpCarRotZ = EyeRotationZ;
		}
		if(Cars[CarIndex].status == 1)
			tmpCarRotZ = EyeRotationZ + Cars[CarIndex].rz;

		if(CarIndex == 0) {
			if(Cars[CarIndex].display == 1)
				DrawObject(2, RoadWork[0], RoadWork[1] + tmpCarY, RoadWork[2], tmpCarRotZ, 0.7);
			else
				DrawObject(1, RoadWork[0], RoadWork[1] + tmpCarY, RoadWork[2], tmpCarRotZ, 0.7);
		} else {
			if(Cars[CarIndex].display == 1)
				DrawObject(13, RoadWork[0], RoadWork[1] + tmpCarY, RoadWork[2], tmpCarRotZ, 0.7);
			else
				DrawObject(11, RoadWork[0], RoadWork[1] + tmpCarY, RoadWork[2], tmpCarRotZ, 0.7);
		}
	}
}

function JS2DFunc() {

	this.ctx;
	this.ImageData;

	this.ScreenWidth = 1;
	this.ScreenHeight = 1;

	this.DrawPoint = null;
	this.TmpDrawPoint = null;

	this.Line_X = null;

	this.TextureData = null;


	this.ClipX0 = function(x0, dataSrc, dataDist) {
		var tmpx0;
		var tmpy0;
		var tmpx1;
		var tmpy1;

		var tmptx0;
		var tmpty0;
		var tmptx1;
		var tmpty1;

		var count = 0;

		var data = dataSrc.data;
		var tmpData = dataDist.data;

		for(var i=0; i<dataSrc.count; i++) {

			tmpx0 = data[i].x;
			tmpy0 = data[i].y;
			tmptx0 = data[i].tx;
			tmpty0 = data[i].ty;

			if(i != (dataSrc.count - 1)) {
				tmpx1 = data[i + 1].x;
				tmpy1 = data[i + 1].y;
				tmptx1 = data[i + 1].tx;
				tmpty1 = data[i + 1].ty;
			} else {
				tmpx1 = data[0].x;
				tmpy1 = data[0].y;
				tmptx1 = data[0].tx;
				tmpty1 = data[0].ty;
			}

			var flag = 0;
			if(tmpx0 < x0)
				flag = 1;
			if(tmpx1 < x0)
				flag |= 2;

			if(flag == 0) {
				tmpData[count].x = tmpx0;
				tmpData[count].y = tmpy0;
				tmpData[count].tx = tmptx0;
				tmpData[count].ty = tmpty0;
				count++;
				continue;
			}

			var tmpx = (x0 - tmpx0) / (tmpx1 - tmpx0);

			if(flag == 1) {
				tmpData[count].x = x0;
				tmpData[count].y = ((tmpy1 - tmpy0) * tmpx + tmpy0);
				tmpData[count].tx = (tmptx1 - tmptx0) * tmpx + tmptx0;
				tmpData[count].ty = (tmpty1 - tmpty0) * tmpx + tmpty0;
				count++;
				continue;
			}

			if(flag == 2) {
				tmpData[count].x = tmpx0;
				tmpData[count].y = tmpy0;
				tmpData[count].tx = tmptx0;
				tmpData[count].ty = tmpty0;
				tmpData[count+1].x = x0;
				tmpData[count+1].y = ((tmpy1 - tmpy0) * tmpx + tmpy0);
				tmpData[count+1].tx = (tmptx1 - tmptx0) * tmpx + tmptx0;
				tmpData[count+1].ty = (tmpty1 - tmpty0) * tmpx + tmpty0;
				count+=2;
			}
		}

		dataDist.count = count;
	}


	this.ClipY0 = function(y0, dataSrc, dataDist) {
		var tmpx0;
		var tmpy0;
		var tmpx1;
		var tmpy1;

		var tmptx0;
		var tmpty0;
		var tmptx1;
		var tmpty1;

		var count = 0;

		var data = dataSrc.data;
		var tmpData = dataDist.data;

		for(var i=0; i<dataSrc.count; i++) {

			tmpx0 = data[i].x;
			tmpy0 = data[i].y;
			tmptx0 = data[i].tx;
			tmpty0 = data[i].ty;

			if(i != (dataSrc.count - 1)) {
				tmpx1 = data[i + 1].x;
				tmpy1 = data[i + 1].y;
				tmptx1 = data[i + 1].tx;
				tmpty1 = data[i + 1].ty;
			} else {
				tmpx1 = data[0].x;
				tmpy1 = data[0].y;
				tmptx1 = data[0].tx;
				tmpty1 = data[0].ty;
			}

			var flag = 0;
			if(tmpy0 < y0)
				flag = 1;
			if(tmpy1 < y0)
				flag |= 2;

			if(flag == 0) {
				tmpData[count].x = tmpx0;
				tmpData[count].y = tmpy0;
				tmpData[count].tx = tmptx0;
				tmpData[count].ty = tmpty0;
				count++;
				continue;
			}

			var tmpy = (y0 - tmpy0) / (tmpy1 - tmpy0);

			if(flag == 1) {
				tmpData[count].x = ((tmpx1 - tmpx0) * tmpy + tmpx0);
				tmpData[count].y = y0;
				tmpData[count].tx = (tmptx1 - tmptx0) * tmpy + tmptx0;
				tmpData[count].ty = (tmpty1 - tmpty0) * tmpy + tmpty0;
				count++;
				continue;
			}

			if(flag == 2) {
				tmpData[count].x = tmpx0;
				tmpData[count].y = tmpy0;
				tmpData[count].tx = tmptx0;
				tmpData[count].ty = tmpty0;
				tmpData[count+1].x = ((tmpx1 - tmpx0) * tmpy + tmpx0);
				tmpData[count+1].y = y0;
				tmpData[count+1].tx = (tmptx1 - tmptx0) * tmpy + tmptx0;
				tmpData[count+1].ty = (tmpty1 - tmpty0) * tmpy + tmpty0;
				count+=2;
			}
		}

		dataDist.count = count;
	}


	this.SetMatrixRotationX = function(mx, rad) {
		mx[0][0] = 1.0;
		mx[0][1] = 0.0;
		mx[0][2] = 0.0;
		mx[0][3] = 0.0;

		mx[1][0] = 0.0;
		mx[1][1] = Math.cos(rad);
		mx[1][2] = Math.sin(rad);
		mx[1][3] = 0.0;

		mx[2][0] = 0.0;
		mx[2][1] = -Math.sin(rad);
		mx[2][2] = Math.cos(rad);
		mx[2][3] = 0.0;

		mx[3][0] = 0.0;
		mx[3][1] = 0.0;
		mx[3][2] = 0.0;
		mx[3][3] = 1.0;
	}


	this.SetMatrixRotationY = function(mx, rad) {
		mx[0][0] = Math.cos(rad);
		mx[0][1] = 0.0;
		mx[0][2] = -Math.sin(rad);
		mx[0][3] = 0.0;

		mx[1][0] = 0.0;
		mx[1][1] = 1.0;
		mx[1][2] = 0.0;
		mx[1][3] = 0.0;

		mx[2][0] = Math.sin(rad);
		mx[2][1] = 0.0;
		mx[2][2] = Math.cos(rad);
		mx[2][3] = 0.0;

		mx[3][0] = 0.0;
		mx[3][1] = 0.0;
		mx[3][2] = 0.0;
		mx[3][3] = 1.0;
	}


	this.SetMatrixRotationZ = function(mx, rad) {
		mx[0][0] = Math.cos(rad);
		mx[0][1] = Math.sin(rad);
		mx[0][2] = 0.0;
		mx[0][3] = 0.0;

		mx[1][0] = -Math.sin(rad);
		mx[1][1] = Math.cos(rad);
		mx[1][2] = 0.0;
		mx[1][3] = 0.0;

		mx[2][0] = 0.0;
		mx[2][1] = 0.0;
		mx[2][2] = 1.0;
		mx[2][3] = 0.0;

		mx[3][0] = 0.0;
		mx[3][1] = 0.0;
		mx[3][2] = 0.0;
		mx[3][3] = 1.0;
	}


	this.SetMatrixTranslation = function(mx, x, y, z) {
		mx[0][0] = 1.0;
		mx[0][1] = 0.0;
		mx[0][2] = 0.0;
		mx[0][3] = 0.0;

		mx[1][0] = 0.0;
		mx[1][1] = 1.0;
		mx[1][2] = 0.0;
		mx[1][3] = 0.0;

		mx[2][0] = 0.0;
		mx[2][1] = 0.0;
		mx[2][2] = 1.0;
		mx[2][3] = 0.0;

		mx[3][0] = x;
		mx[3][1] = y;
		mx[3][2] = z;
		mx[3][3] = 1.0;
	}


	this.GetMatrixArray = function() {
		return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	}


	this.Matrix_Multiply = function(mx0, mx1, mx2) {
		for(var i=0; i<4; i++) {
			for(var j=0; j<4; j++) {
				mx2[i][j] = mx0[i][0] * mx1[0][j] + mx0[i][1] * mx1[1][j] + mx0[i][2] * mx1[2][j] + mx0[i][3] * mx1[3][j];
			}
		}
	}


	this.Vertex_Multiply = function(vr0, mx0, vr1, vr0i, vr1i, count) {
		var m00 = mx0[0][0];
		var m01 = mx0[0][1];
		var m02 = mx0[0][2];
		var m03 = mx0[0][3];

		var m10 = mx0[1][0];
		var m11 = mx0[1][1];
		var m12 = mx0[1][2];
		var m13 = mx0[1][3];

		var m20 = mx0[2][0];
		var m21 = mx0[2][1];
		var m22 = mx0[2][2];
		var m23 = mx0[2][3];

		var m30 = mx0[3][0];
		var m31 = mx0[3][1];
		var m32 = mx0[3][2];
		var m33 = mx0[3][3];

		vr0i <<= 2;
		vr1i <<= 2;
		for(var i=0; i<count; i++) {
			vr1[vr1i]     = vr0[vr0i] * m00 + vr0[vr0i + 1] * m10 + vr0[vr0i + 2] * m20 + vr0[vr0i + 3] * m30;
			vr1[vr1i + 1] = vr0[vr0i] * m01 + vr0[vr0i + 1] * m11 + vr0[vr0i + 2] * m21 + vr0[vr0i + 3] * m31;
			vr1[vr1i + 2] = vr0[vr0i] * m02 + vr0[vr0i + 1] * m12 + vr0[vr0i + 2] * m22 + vr0[vr0i + 3] * m32;
			vr1[vr1i + 3] = vr0[vr0i] * m03 + vr0[vr0i + 1] * m13 + vr0[vr0i + 2] * m23 + vr0[vr0i + 3] * m33;

			vr0i += 4;
			vr1i += 4;
		}
	}


	this.Init = function(CanvasId, w, h) {
		var canvas0 = document.getElementById(CanvasId);
		if (!canvas0.getContext)
			return false;
		this.ctx = canvas0.getContext("2d");

		this.ScreenWidth = w;
		this.ScreenHeight = h;

		this.Line_X = new Array(this.ScreenHeight);
		for(var i=0; i<this.Line_X.length; i++)
			this.Line_X[i] = new Array(0, 0, 0, 0, 0, 0);

		this.ImageData = this.ctx.getImageData(0, 0, this.ScreenWidth, this.ScreenHeight);

		for(var i=0; i<this.ScreenWidth * this.ScreenHeight * 4; i+=4) {
			this.ImageData.data[i + 3] = 255;
		}

		this.TmpDrawPoint = this.GetDrawData();
	}


	this.Edge = function(i0, i1) {
		var tmpDrawPointData = this.DrawPoint.data;
		if(tmpDrawPointData[i0].y > tmpDrawPointData[i1].y) {
			var tmp = i0;
			i0 = i1;
			i1 = tmp;
		}

		var y0 = tmpDrawPointData[i0].y | 0;
		var y1 = tmpDrawPointData[i1].y | 0;

		if(y0 == y1)
			return;

		var x0 = tmpDrawPointData[i0].x;
		var x1 = tmpDrawPointData[i1].x;
		var tx0 = tmpDrawPointData[i0].tx;
		var ty0 = tmpDrawPointData[i0].ty;

		var tmpx = (x1 - x0) / (y1 - y0);
		var tmpy = y1 - y0 + 1;
		var tmptx = (tmpDrawPointData[i1].tx - tx0) / tmpy;
		var tmpty = (tmpDrawPointData[i1].ty - ty0) / tmpy;

		tx0 += tmptx;
		ty0 += tmpty;

		if (y1 > this.ScreenHeight - 1)
			y1 = this.ScreenHeight - 1;

		for(var i=y0; i<=y1; i++) {
			var tmpLine = this.Line_X[i];

			if(tmpLine[0] == -1) {
				tmpLine[0] = x0 | 0;
				tmpLine[2] = tx0;
				tmpLine[3] = ty0;
			} else {
				/*var x = x0 | 0;
				if(tmpLine[1] < x) {
					tmpLine[1] = x;
					tmpLine[4] = tx0;
					tmpLine[5] = ty0;
				}*/
				tmpLine[1] = x0 | 0;
				tmpLine[4] = tx0;
				tmpLine[5] = ty0;
			}

			x0 += tmpx;
			tx0 += tmptx;
			ty0 += tmpty;
		}
	}


	this.InitDraw2d = function(r, g, b) {
		var data = this.ImageData.data;
		for(var i=0; i<this.ScreenWidth * this.ScreenHeight * 4; i+=4) {
			data[i] = r;
			data[i + 1] = g;
			data[i + 2] = b;
		}
	}


	this.Draw2dFunction = function() {

		var tmpDrawPoint = this.DrawPoint;
		var tmpDrawPointData = this.DrawPoint.data;

		var flagX = false;
		var flagY = false;
		for(var i=0; i<tmpDrawPoint.count; i++) {
			if(tmpDrawPointData[i].x < this.ScreenWidth)
				flagX = true;
			if(tmpDrawPointData[i].y < this.ScreenHeight)
				flagY = true;
		}
		if(flagX == false || flagY == false)
			return;

		var tmpDataWork = this.TmpDrawPoint;
		this.ClipX0(0, tmpDrawPoint, tmpDataWork);
		if(tmpDataWork.count == 0)
			return;

		this.ClipY0(0, tmpDataWork, tmpDrawPoint);
		if(tmpDrawPoint.count == 0)
			return;

		var tmpLine_X = this.Line_X;
		for(var i=0; i<this.ScreenHeight; i++)
			tmpLine_X[i][0] = tmpLine_X[i][1] = -1;

		var tmpIndex = 0;
		for(var i=1; i<tmpDrawPoint.count; i++) {
			if(tmpDrawPointData[i].y < tmpDrawPointData[tmpIndex].y || 
			  (tmpDrawPointData[i].y == tmpDrawPointData[tmpIndex].y && tmpDrawPointData[i].x < tmpDrawPointData[tmpIndex].x))
				tmpIndex = i;
		}

		var tmpMinY = tmpDrawPointData[tmpIndex].y | 0;

		if((tmpDrawPointData[2].x - tmpDrawPointData[1].x) * (tmpDrawPointData[0].y - tmpDrawPointData[1].y) -
		   (tmpDrawPointData[2].y - tmpDrawPointData[1].y) * (tmpDrawPointData[0].x - tmpDrawPointData[1].x) < 0) {
			for(var i=0; i<tmpDrawPoint.count; i++) {
				if(tmpIndex != (tmpDrawPoint.count - 1)) {
					this.Edge(tmpIndex, tmpIndex + 1);
					tmpIndex++;
				} else {
					this.Edge(tmpIndex, 0);
					tmpIndex = 0;
				}
			}
		} else {
			for(var i=0; i<tmpDrawPoint.count; i++) {
				if(tmpIndex != 0) {
					this.Edge(tmpIndex, tmpIndex - 1);
					tmpIndex--;
				} else {
					this.Edge(tmpIndex, (tmpDrawPoint.count - 1));
					tmpIndex = tmpDrawPoint.count - 1;
				}
			}
		}

		var data = this.ImageData.data;
		var txd = this.TextureData;
		var tmpScreenWidth = this.ScreenWidth;
		var tmpScreenHeight = this.ScreenHeight;

		for(var i=tmpMinY; i<tmpScreenHeight; i++) {
			var tmpLine = tmpLine_X[i];

			var x0 = tmpLine[0];
			var x1 = tmpLine[1];
			if(x0 == -1 || x1 == -1)
				break;

			var tx0 = tmpLine[2];
			var ty0 = tmpLine[3];

			var tmpDiv = x1 - x0 + 1;
			var tmptx = ((tmpLine[4] - tx0) / tmpDiv * 1024) | 0;
			var tmpty = ((tmpLine[5] - ty0) / tmpDiv * 1024) | 0;

			tx0 = ((tx0 * 1024) | 0) + tmptx;
			ty0 = ((ty0 * 1024) | 0) + tmpty;

			x0 = (i * tmpScreenWidth + x0) << 2;
			if(x1 >= tmpScreenWidth)
				x1 = ((i + 1) * tmpScreenWidth - 1) << 2;
			else
				x1 = (i * tmpScreenWidth + x1) << 2;

			for(; x0<=x1; x0+=4) {
				var color = txd[(ty0 & 0xFFC00) + (tx0 >> 10)];
				if(color != 0) {
					data[x0]     = color & 0xFF;
					data[x0 + 1] = (color >> 8) & 0xFF;
					data[x0 + 2] = color >> 16;
				}
				tx0 += tmptx;
				ty0 += tmpty;
			}
		}
	}


	this.PutImage = function() {
		this.ctx.putImageData(this.ImageData, 0, 0);
	}


	this.Draw2d = function(data) {
		this.DrawPoint = data;
		this.Draw2dFunction();
	}


	this.SetTextureData = function(data) {
		this.TextureData = data;
	}


	this.GetDrawData = function() {
		var tmp = {zindex: -1, count: 0, data: new Array(8)};
		for(var i=0; i<tmp.data.length; i++)
			tmp.data[i] = {x: 0, y: 0, tx: 0, ty: 0};
		return tmp;
	}


	this.GetDrawDataArray = function(len) {
		tmp = new Array(len)
		for(var i=0; i<len; i++)
			tmp[i] = this.GetDrawData();
		return tmp;
	}


	this.Init2dArray = function(data) {
		for(var i=0; i<data.length; i++)
			data[i].zindex = -1;
	}


	this.Draw2dArray = function(data) {
		data.sort(function(a, b){ return b.zindex - a.zindex; });
		for(var i=0; i<data.length; i++) {
			if(data[i].zindex == -1)
				break;
			this.Draw2d(data[i]);
		}
	}


	this.GetUnitVector = function(x, y, z) {
		var tmp = Math.sqrt(x * x + y * y + z * z);
		return {x: x / tmp, y: y / tmp, z: z / tmp};
	}


	this.GetVector = function(x, y, z) {
		return Math.sqrt(x * x + y * y + z * z);
	}


	this.ScalarProduct = function(Lx, Ly, Lz, Cx, Cy, Cz) {
		return (Lx * Cx + Ly * Cy + Lz * Cz) / (Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz) * Math.sqrt(Cx * Cx + Cy * Cy + Cz * Cz));
	}


	this.VectorProduct = function(Lx, Ly, Lz, Cx, Cy, Cz) {
		return {x: Cy * Lz - Cz * Ly, y: Cz * Lx - Cx * Lz, z: Cx * Ly - Cy * Lx};
	}


	this.Rotation2d = function(data, work, rad, t, x, y, count) {
		var sin = Math.sin(rad)
		var cos = Math.cos(rad);

		for(var i=0; i<count*2; i+=2) {
			var tmpx = data[i] * cos - data[i + 1] * sin;
			var tmpy = data[i] * sin + data[i + 1] * cos;

			work[i]     = tmpx * t + x;
			work[i + 1] = tmpy * t + y;
		}
	}
}

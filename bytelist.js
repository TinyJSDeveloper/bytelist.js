/*
 * bytelist.js v0.1
 *
 * Released under BSD 3-Clause License:
 * https://github.com/TinyJSDeveloper/bytelist.js/blob/master/LICENSE
 *
 * Copyright (c) 2014, TinyJSDeveloper
 * All rights reserved.
 */

function ByteMini()
{
this.value = [];

/// Tamanho da ByteArray:
this.size = function(){
	//@function_Start:
	return this.value.length;
	};

/// Converter uma String para uma Array de Char Codes:
this.intfyString = function(sentString){
	//@function_Start:
	var strArray = [];
	
	for(i = 0; i < sentString.length; i += 1){
		//@for_Start:
		strArray[i] = sentString.charCodeAt(i);
		}
	
	return strArray;
	};

/// Zerar a ByteArray:
this.clear = function(clearMode,startPos,howManyBytes){
	//@function_Start:
	if(howManyBytes < 1 || howManyBytes == null){
		//@if_Start:
		howManyBytes = 1;
		}
	
	if(clearMode === '@range'){
		//@if_Start:
		for(i = 0; i < howManyBytes; i += 1){
			//@for_Start:
			this.value.splice(startPos+i,1);
			}
		}
	
	else if(clearMode === '@all'){
		//@elseif_Start:
		this.value = [];
		}
	};

/// Escrever uma série de valores na ByteArray:
this.write = function(byteArray,typeMode,startPos){
	//@function_Start:
	var Uint8Data = new Uint8Array(1);
	
	if(startPos < 0 || startPos == null){
		//@if_Start:
		startPos = 0;
		}
	
	if(typeof byteArray === 'string'){
		//if_Start:
		byteArray = this.intfyString(byteArray);
		}
	
	for(i = 0; i < byteArray.length; i += 1){
		//@for_Start:
		Uint8Data[0] = byteArray[i];
		
		if(typeMode === '@ins'){
			//@if_Start:
			this.value.splice(startPos+i,0,Uint8Data[0]);
			}
		else if(typeMode === '@ovr'){
			//@elseif_Start:
			this.value[startPos+i] = Uint8Data[0];
			}
		else if(typeMode === '@rep'){
			//@elseif_Start:
			if(i === 0){
				//@if_Start:
				this.clear('@all');
				}
			
			this.value[i] = Uint8Data[0];
			}
		}
	};

/// Operações matemáticas:
this.math = function(sentValue,mathSymbol,startPos,howManyBytes){
	//@function_Start:
	var numArray = [];
	var numString;
	
	if(startPos < 0 || startPos == null){
		//@if_Start:
		startPos = 0;
		}
	
	if(howManyBytes < 1 || howManyBytes == null){
		//@if_Start:
		howManyBytes = 1;
		}
	
	for(i = 0; i < howManyBytes; i += 1){
		//@for_Start:
		numArray[i] = this.value[startPos+i];
		numArray[i] = numArray[i].toString(16);
		
		if(numArray[i].length % 2 === 1){
			//if_Start:
			numArray[i] = '0' + numArray[i];
			}
		}
	
	numString = numArray.join('');
	numString = parseInt(numString,16);
	
	if(mathSymbol === '@+'){
		//@if_Start:
		numString = numString + sentValue;
		}
	else if(mathSymbol === '@-'){
		//@elseif_Start:
		numString = numString - sentValue;
		}
	else if(mathSymbol === '@*'){
		//@elseif_Start:
		numString = numString * sentValue;
		}
	else if(mathSymbol === '@/'){
		//@elseif_Start:
		numString = numString / sentValue;
		}
	
	numString = numString.toString(16);
	for(i = numString.length; i < numArray.length*2; i += 1){
		//@for_Start:
		numString = '0' + numString;
		}
		
	for(i = 0; i < numArray.length; i += 1){
		//@for_Start:
		numArray[i] = numString[i*2] + numString[i*2+1];
		numArray[i] = parseInt(numArray[i],16);
		}
	
	this.write(numArray,'@ovr',startPos);
	};
}

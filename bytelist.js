/*
 * bytelist.js v0.0
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
this.clear = function(clearMode,startPos,howMany){
	//@function_Start:
	if(howMany < 1 || howMany == null){
		//@if_Start:
		howMany = 1;
		}
	
	if(clearMode === '@range'){
		//@if_Start:
		for(i = 0; i < howMany; i += 1){
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
		if(typeMode === '@ins'){
			//@if_Start:
			this.value.splice(startPos+i,0,byteArray[i]);
			}
		
		else if(typeMode === '@ovr'){
			//@elseif_Start:
			this.value[startPos+i] = byteArray[i];
			}
		
		else if(typeMode === '@rep'){
			//@elseif_Start:
			this.clear('@all');
			this.value[i] = byteArray[i];
			}
		}
	};
}

/*
 * bytelist.js v0.0
 *
 * Released under BSD 3-Clause License:
 * https://github.com/TinyJSDeveloper/bytelist.js/blob/master/LICENSE
 *
 * Copyright (c) 2014, TinyJSDeveloper
 * All rights reserved.
 */

function ByteManager()
	{
	/// Array de bytes. Aqui serão guardados todos os bytes declarados:
	this.byteArray = [];
	
	/// Limpar a 'byteArray':
	this.emptyByteArray = function(){
		this.byteArray = [];
		};
	
	/// Retorna a próxima posição livre para um novo byte:
	this.nextBytePosition = function(){
		return this.byteArray.length;
		};
	
	/// Obter o valor de um byte em uma determinada posição:
	this.getByte = function(position){
		return this.byteArray[position];
		};
	
	/// Obter uma sequência de bytes:
	this.getByteSeq = function(position,byteSize){
		// Se o tamanho do byte não for especificado, seu valor será 0:
		if(byteSize >= 0){
			byteSize = byteSize;
			}
		else{
			byteSize = 0;
			}
		
		var byteSeq;			  			  // Guardará uma sequência de bytes.
			byteSeq = this.getByte(position); // Guardar, antes de tudo, a posição do primeiro byte.
		
		// Dividir o valor recebido em blocos de bytes (8-bits por bloco):
		for(i = 0; i < byteSize; i += 1){
			byteSeq = byteSeq + this.getByte(position+1);
			}
		
		return byteSeq;
		};
	
	/// Uint8:[X] Int:[X] Hex:[ ] Converter um valor para Uint8. Suporta apenas valores inteiros:
	this.toUint8 = function(integer){
		var byteInt;					   // Guardará a versão Uint8 do número inteiro passado.
			byteInt = Math.floor(integer); // Caso o número seja, de alguma forma, float, ele será arredondado.
		
		// Condições para números não-válidos (com valor negativo ou hexadecimal maior que 8 bits):
		while(byteInt > 255 || byteInt < 0){
			if(byteInt > 255){
				byteInt = byteInt - 256;
				}
			else if(byteInt < 0){
				byteInt = 256 + byteInt;
				
				if(byteInt >= -255){
					byteInt = 255 + byteInt;
					}
				}
			}
		
		return byteInt;	
		};
	
	/// Uint8:[ ] Int:[ ] Hex:[X] Converter um valor para inteiro. Suporta apenas valores hexadecimais:
	this.toInt = function(integer){
		var byteInt;						// Guardará o valor convertido.
			byteInt = parseInt(integer,16); // Convertê-lo para inteiro 'puro'.
		
		return byteInt;
		};
	
	/// Uint8:[X] Int:[X] Hex:[X] Converter um valor para hexadecimal. Suporta todos os tipos de valores:
	this.toHex = function(integer){
		var hexNum;						   // Guardará a versão hexadecimal do número inteiro passado.
			hexNum = integer.toString(16); // Converter o número inteiro para uma string hexadecimal.
			hexNum = hexNum.toUpperCase(); // Usar letras maiúsculas para unidades maiores que 9.
		
		// Adicionar um '0' no início do valor, caso necessário:
		if(hexNum.length % 2 == 1){
			hexNum = "0" + hexNum;
			}
	
		return hexNum;
		};
	
	/// Processar valores. Suporta todos os tipos e sempre retornará um valor hexadecimal:
	this.processByte = function(byteInt){
		byteInt = this.toHex(byteInt);   // Se o valor não for hexadecimal, ele será convertido.
		byteInt = this.toInt(byteInt);   // Após isso, converter este número para obter seu valor real em inteiro.
		byteInt = this.toUint8(byteInt); // Converter o número inteiro para Uint8.
		byteInt = this.toHex(byteInt);   // E finalmente, passá-lo de volta para hexadecimal.
		
		return byteInt;
		};
	
	/// Criar e inserir um novo byte:
	this.writeByte = function(byteInt,txtMode,position){
		var byteHex; 				   // Guardará a versão hexadecimal do número inteiro passado.
		var byteType;				   // Guardará o tipo do valor que foi entregue.
			byteType = typeof byteInt; // A variável deverá receber um desses tipos: ["number"]["object"]["string"].
		
		// Se a posição não for especificada, ela será o último lugar disponível na tabela:
		if(position >= 0){
			position = position;
			}
		else{
			position = this.nextBytePosition();
			}
		
		// Valor padrão para o modo de texto, caso nenhum formato recebido pelo 'txtMode' seja válido:
		if(txtMode == "ins" || txtMode == "ovr" || txtMode == "rep"){
			txtMode = txtMode;
			}
		else{
			txtMode = "ins";
			}
		
		// Método de inserção:
		if(txtMode === "ins"){
			if(byteType == "object"){
				for(i = 0; i < byteInt.length; i += 1){
					// Processar o byte recebido:
					byteHex = this.processByte(byteInt[i]);
					
					// Alocar byte em sua posição:
					this.byteArray.splice(position+i,0,byteHex);
					}
				}
			else{
				// Processar o byte recebido:
				byteHex = this.processByte(byteInt);
				
				// Alocar byte em sua posição:
				this.byteArray.splice(position,0,byteHex);
				}
			}
		
		// Método de sobrescrição:
		else if(txtMode === "ovr"){
			if(byteType == "object"){
				for(i = 0; i < byteInt.length; i += 1){
					// Processar o byte recebido:
					byteHex = this.processByte(byteInt[i]);
					
					// Reescrita do byte para o novo valor:
					this.byteArray[position+i] = byteHex;
					}
				}
			else{
				// Processar o byte recebido:
				byteHex = this.processByte(byteInt);
				
				// Reescrita do byte para o novo valor:
				this.byteArray[position] = byteHex;	
				}
			}
		// Método de substituição:
		else if(txtMode === "rep"){
			// Limpar a 'byteArray':
			this.emptyByteArray();
			
			if(byteType == "object"){
				for(i = 0; i < byteInt.length; i += 1){
					// Processar o byte recebido:
					byteHex = this.processByte(byteInt[i]);
					
					// Alocar byte em sua posição:
					this.byteArray[i] = byteHex;
					}
				}
			else{
				// Processar o byte recebido:
				byteHex = this.processByte(byteInt);
				
				// Alocar byte em sua posição:
				this.byteArray[0] = byteHex;
				}
			}
		};
	
	/// Escrever uma string em formato de byte:
	this.writeString = function(txtString,txtMode,position){
		var stringArray = []; // Guardará a string em formato de byte.
		var byteHex;		  // Armazenará cada caracter e o tornará hexadecimal.
		
		// Coletar cada caracter individualmente e transformá-lo em hexadecimal:
		for(i = 0; i < txtString.length; i += 1){
			byteHex = txtString.charCodeAt(i);
			byteHex = this.processByte(byteHex);
			stringArray[i] = byteHex;
			}
		
		// Escrever a string na 'byteArray':
		this.writeByte(stringArray,txtMode,position);
		};
	
	/// Apagar por completo um ou mais blocos de bytes:
	this.clearByte = function(position,range){
		// Se a distância não for especificada, seu valor deverá ser '1':
		if(range >= 1){
			range = range;
			}
		else{
			range = 1;
			}
		
		// Processo de apagamento dos bytes:
		for(i = 0; i < range; i += 1){
			this.byteArray.splice(position,1);
			}
		};
	
	/// Operações matemáticas com um bloco de valores. O 'byteSize' indica quantos bytes, do início à direita no total, ele usará:
	this.mathByte = function(position,mathSymbol,integer,byteSize){
		// Se o tamanho do byte não for especificado, seu valor será 0:
		if(byteSize >= 1){
			byteSize = byteSize - 1;
			}
		else{
			byteSize = 0;
			}
		
		var byteSeq;									  // Guardará uma sequência de bytes.
			byteSeq = this.getByteSeq(position,byteSize); // Coletar uma quantidade de bytes definida em 'byteSize'. [ANALISE ESTA FUNÇÃO, POR FAVOR!]
			byteSeq = this.toInt(byteSeq);				  // Converter o valor para inteiro.
		
		var operand;					   		 // Guardará o valor que será usado junto com a sequência obtida.
			operand = this.processByte(integer); // Caso o valor não seja hexadecimal, a conversão é necessária.
			operand = this.toInt(operand); 		 // Converter o valor para inteiro.
		
		// Esta variável guardará o resultado da operação:
		var result;
		
		// Valor padrão no caso do 'mathSymbol' não ter recebido nenhum dos 4 símbolos matemáticos válidos:
		if(mathSymbol === "+" || mathSymbol === "-" || mathSymbol === "*" || mathSymbol === "/"){
			mathSymbol = mathSymbol;
			}
		else{
			mathSymbol = "+";
			}
		
		// Soma:
		if(mathSymbol === "+"){
			result = byteSeq + operand;
			}
		
		// Subtração:
		else if(mathSymbol === "-"){
			result = byteSeq - operand;
			}
		
		// Multiplicação:
		else if(mathSymbol === "*"){
			result = byteSeq * operand;
			}
		
		// Divisão:
		else if(mathSymbol === "/"){
			result = byteSeq / operand;
			}
		
		// Passar o resultado final para hexadecimal:
		result = this.toHex(result);
		
		// Complementar bytes restantes com zeros:
		if(result.length/2 != byteSize+1){
			for(i = 0; i < byteSize; i += 1){
				result = "00" + result;
				}
			}
		
		// Preencher todos os bytes necessários para acomodar o valor obtido:
		for(i = 0; i < result.length/2; i += 1){
			this.writeByte(result[i*2] + result[i*2+1],"ovr",position+i);
			}
		};
	
	/// Importar uma Array externa para a 'byteArray':
	this.importArray = function(extArray,impMode,position){
		// Guardará todos os valores da Array importada em formato hexadecimal:
		var hexArray = [];
		
		// Processar todos os bytes Uint8 para o formato hexadecimal:
		for(i = 0; i < extArray.length; i += 1){
			hexArray[i] = this.processByte(extArray[i]);
			}
		
		// Escrever os bytes importados:
		this.writeByte(hexArray,impMode,position);
		};
	
	/// Exportar a 'byteArray' para uma Array externa:
	this.exportArray = function(valueFormat,pkgSize){
		// Valor padrão para caso o 'pkgSize' não ter recebido um valor válido:
		if(pkgSize >= 1){
			pkgSize = pkgSize;
			}
		else{
			pkgSize = this.nextBytePosition();
			}
		
		var pkgArray;			 // Guardará a 'byteArray' em um determinado formato.
		var byteHex;			 // Guardará o valor de um byte em hexadecimal.
		var pkgLength;			 // Guardará o tamanho da 'byteArray'.
			pkgLength = pkgSize; // Obter o tamanho do pacote.
		
		// Valor padrão para caso o 'valueFormat' não ter recebido um valor válido:
		if(valueFormat === "byte" || valueFormat === "hex"){
			valueFormat = valueFormat;
			}
		else{
			valueFormat = "hex";
			}
		
		// Empacotar uma Array em formato de byte:
		if(valueFormat == "byte"){
			// Declarar uma Array de bytes:
			pkgArray = new Uint8Array(pkgLength);
			
			for(i = 0; i < pkgLength; i += 1){
				byteHex = this.byteArray[i];   // Obter um byte da 'byteArray'.
				byteHex = this.toInt(byteHex); // Convertê-lo a um número inteiro.
				
				// Jogá-lo no pacote:
				pkgArray[i] = byteHex;
				}
			}
		// Empacotar uma Array em formato hexadecimal:
		else if(valueFormat == "hex"){
			// Declarar uma Array de bytes:
			pkgArray = [];
			
			for(i = 0; i < pkgLength; i += 1){
				byteHex = this.byteArray[i];	     // Obter um byte da 'byteArray'.
				byteHex = this.processByte(byteHex); // Convertê-lo a um número hexadecimal.
				
				// Jogá-lo no pacote:
				pkgArray[i] = byteHex;
				}
			}
		
		return pkgArray;
		};
	}

/// Utilitário global com todas as funções relacionadas a dados de memória:
var Utility = new ByteManager();

/// 'dynamic' or 'static':
function ByteArray(arrayType,arraySize)
	{
	// Valor padrão para caso o tipo da Array não ter sido corretamente definido:
	if(arrayType === "static" || arrayType === "dynamic"){
		arrayType = arrayType;
		}
	else{
		arrayType = "static";
		}
	
	/// Array de bytes e o tipo da variável:
	this.value = new Uint8Array(0);
	this.type = arrayType;
	this.size = arraySize;
	
	/// Importar a 'byteArray' do Utilitário para cá:
	this.importUtil = function(){
		// Exportar para uma variável estática (o tamanho do pacote é fixo):
		if(this.type == "static"){
			this.value = Utility.exportArray("byte",this.size);
			}
		// Exportar para uma variável dinâmica (o tamanho do pacote é ilimitado):
		else if(this.type == "dynamic"){
			this.value = Utility.exportArray("byte",0);
			}
		
		Utility.emptyByteArray();	   // Limpar o Utilirário.
		this.size = this.value.length; // Atualizar a Length.
		};
	
	/// Escrever bytes na Array:
	this.write = function(paramValue,txtMode,position){
		// Importar a Array para o utilitário:
		Utility.importArray(this.value,"rep",0);
		
		// Caso o tipo do valor seja String, o Utilitário converterá tudo para hexadecimal:
		if(typeof paramValue == "string"){
			Utility.writeString(paramValue,txtMode,position);
			}
		// Caso contrário, os bytes são passados normalmente:
		else{
			Utility.writeByte(paramValue,txtMode,position);
			}
		
		// Exportar o resultado final:
		this.importUtil();
		};
	
	/// Limpar um ou mais valores da Array:
	this.clear = function(position,range){
		Utility.importArray(this.value,"rep",0); // Importar a Array para o utilitário.
		Utility.clearByte(position,range);		 // Limpar bytes.
		
		// Caso a variável seja estática, os bytes perdidos serão complementados com zeros no final da Array:
		if(this.type == "static"){
			for(i = 0; i < range; i += 1){
				Utility.writeByte(0x0,'ins');
				}
			}
		// Exportar o resultado final:
		this.importUtil();
		};
	
	/// Operações matemáticas:
	this.math = function(mathSymbol,integer){
		Utility.importArray(this.value,"rep",0); 				  // Importar a Array para o utilitário.
		Utility.mathByte(0,mathSymbol,integer,this.value.length); // Fazer uma operação matemática.
		
		// Exportar o resultado final:
		this.importUtil();
		};
	
	/// Coletar o valor da Array:
	this.getArray = function(valueFormat){
		// Importar a Array para o utilitário:
		Utility.importArray(this.value,"rep",0);
		
		// Empacotar a Array no formato desejado e depois retorná-la:
		var pkgArray;
			pkgArray = Utility.exportArray(valueFormat,this.size);
		
		return pkgArray;
		};
	}

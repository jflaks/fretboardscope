	
var guitartool
$(function(){
	guitartool = (function(){
		var nameMode = "name", noteMode = "note", stringMap, strings, template, controltemplate, scaleMap, noteMap, noteKeys, noteNumMap, scaleKeys, scaleNameMap,
			chordChoiceMap, chordScaleMap
		
		initializeStringMap();
		initializeScaleMap();
		initializeNoteMap();
		initializeChordChoiceMap();
		initializeChordScaleMap();
		initializeNoteNumMap();
		initializeScaleNameMap();
		initializeTemplates();
		drawFretboard()
		drawControls()
		bindControls()
		
		function initializeStringMap() {
			stringMap = {
				"Standard Guitar" : ['E','B','G','D','A','E'],	
				"Fourths Guitar" : ['F','C','G','D','A','E'],
				"DADGAD Guitar" : ['D','A','G','D','A','D'],
				"Mandolin" : ['E','A','D','G'],
				"Standard Bass" : ['G','D','A','E'],
				"5 string Bass" : ['G','D','A','E','B'],
				"Stick Standard" : ['D','A','E','B','F#','C','G','D','A','E']		
			}
			strings = stringMap["Standard Guitar"] //initial choice

		}
		function initializeScaleMap() {
			scaleMap = {
				none : {notes: [], 
					names: [], title: 'None'},
				ionian : {notes: [0,2,4,5,7,9,11], 
					names: ['1','2','3','4','5','6','7'], title: 'Ionian / Nat Major'},
				dorian : {notes: [0,2,3,5,7,9,10], 
					names: ['1','2','b3','4','5','6','b7'], title: 'Dorian'},
				phrygian : {notes: [0,1,3,5,7,8,10], 
					names: ['1','b2','b3','4','5','b6','b7'], title: 'Phrygian'},
				lydian : {notes: [0,2,4,6,7,9,11],
					names: ['1','2','3','#4','5','6','7'],  title: 'Lydian'},
				mixolydian : {notes: [0,2,4,5,7,9,10],
					names: ['1','2','3','4','5','6','b7'], title: 'Mixolydian'}, 
				aeolian : {notes: [0,2,3,5,7,8,10], 
					names: ['1','2','b3','4','5','b6','b7'], title: 'Aeolian / Nat Minor'},
				locrian : {notes: [0,1,3,5,6,8,10], 
					names: ['1','b2','b3','4','b5','b6','b7'], title: 'Locrian'},
				lydianb7 : {notes: [0,2,4,6,7,9,10],
					names: ['1','2','3','#4','5','6','b7'],  title: 'Lydian Flat 7'},
				min7 : {notes: [0,3,7,10], 
					names: ['1','b3','5','b7'], title: 'Min7 Arp'},  
				maj7 : {notes: [0,4,7,11], 
					names: ['1','3','5','7'], title: 'Maj7 Arp'},
				dom7 : {notes: [0,4,7,10], 
					names: ['1','3','5','b7'], title: 'Dom7 Arp'},	
				minpent : {notes: [0,3,5,6,7,10],
					names: ['1','3','4','b5','5','7'], title: 'Minor blues'}	
			};
		}
		function initializeNoteMap() {
			noteMap = { 'C': 0, 'C#':1, 'D':2, 'D#':3, 'E':4, 'F':5, 'F#':6, 'G':7, 'G#':8, 'A':9, 'A#':10, 'B':11 }
		}
		function initializeTemplates() {
			template = $('#fret_template').html()
			controltemplate = $('#key_control_template').html()

		}
		function initializeChordChoiceMap() {
			chordChoiceMap = { 
				maj7: 'Major 7', 
				min7: 'Minor 7', 
				dom7: 'Dom 7',
				dom11: 'Dom 7sus4',
				key: 'Major key'
			}
		}
		function initializeChordScaleMap() {			
			chordScaleMap = {
				key : [ 
					{ shift: 0, scale: 'ionian'},
					{ shift: 2, scale: 'dorian'},
					{ shift: 4, scale: 'phrygian'},
					{ shift: 5, scale: 'lydian'},
					{ shift: 7, scale: 'mixolydian'},
					{ shift: 9, scale: 'aeolian'},
					{ shift: 11, scale: 'locrian'},
				],
				min7 : [
					{ shift: 0, scale: 'dorian'},
					{ shift: 0, scale: 'aeolian'},
					{ shift: 0, scale: 'minpent'},
					{ shift: 2, scale: 'minpent'},
					{ shift: 7, scale: 'minpent'},
					{ shift: 0, scale: 'min7'},
					{ shift: 7, scale: 'min7'},
					{ shift: 3, scale: 'maj7'},
					{ shift: 5, scale: 'maj7'},
					{ shift: 10, scale: 'maj7'}
				],
				maj7 : [
					{ shift : 0, scale: 'ionian'},
					{ shift : 0, scale: 'lydian'},
					{ shift: 4, scale: 'minpent'},
					{ shift: 9, scale: 'minpent'},
					{ shift: 11, scale: 'minpent'},
					{ shift : 4, scale: 'min7'},
					{ shift : 9, scale: 'min7'},
					{ shift : 11, scale: 'min7'},
					{ shift: 7, scale: 'maj7'}
				],
				dom7 : [
					{ shift : 0, scale: 'lydianb7'},
					{ shift: 9, scale: 'minpent'},
					{ shift: 0, scale: 'dom7'},
					{ shift: 2, scale: 'dom7'},
					{ shift: 9, scale: 'min7'}
				],
				dom11 : [
					{ shift : 0, scale: 'mixolydian'},
					{ shift: 2, scale: 'minpent'},
					{ shift: 7, scale: 'minpent'},
					{ shift: 9, scale: 'minpent'},
					{ shift: 0, scale: 'dom7'},
					{ shift: 7, scale: 'min7'},
					{ shift: 9, scale: 'min7'},
					{ shift: 5, scale: 'maj7'},
					{ shift: 10, scale: 'maj7'}
				]

			}
		}
		function initializeNoteNumMap() {
			noteKeys = Object.keys(noteMap);
			noteNumMap = {};
			for (var i=0; i<noteKeys.length; i++) {
				var noteName = noteKeys[i];
				var noteNum = noteMap[noteName];
				noteNumMap[noteNum] = noteName;
			}
		}
		function initializeScaleNameMap() {
			scaleKeys = Object.keys(scaleMap);
			scaleNameMap = {};
			for (var i=0; i<scaleKeys.length; i++) {
				var scaleName = scaleKeys[i];
				var scaleDesc = scaleMap[scaleName].title;
				scaleNameMap[scaleName] = scaleDesc;
			}
		}

		function drawFretboard() {
			$('#guitarneck').empty()
			for (var i=0; i<strings.length; i++) {
				var stringDiv = document.createElement('div')
				stringDiv.className = 'guitarString'
				stringDiv.id = 'string' + i
				$('#guitarneck').append(stringDiv)
				for (var j=1; j<=12; j++) {
					var model = {string: i, fret: j}
					var elem = Mustache.to_html(template,model)				
					$('#string' + i).append(elem)				
				}
			}
		}
		function drawControls() {
			for (var i=1; i<4; i++) {
				var elem = Mustache.to_html(controltemplate,{layer: i})
				$('#keycontrols').append(elem)
			}

			var counter = 0
			$.each(noteNumMap, function(key, value) {   
	   		  $('.key_choice')
	         	.append($("<option " + (counter == 0 ? "selected=true" : '') + "></option>")
	         	.attr("value",key)
		         	.text(value));
		       counter++ 
			});
			$.each(chordChoiceMap, function(key, value) {   
	   		  $('.chord_choice')
	         	.append($("<option></option>")
	         	.attr("value",key)
		         	.text(value)); 
			});

			$.each(stringMap, function(key, value) {   
	   		  $('.tuning_choice')
	         	.append($("<option></option>")
	         	.attr("value",key)
		         	.text(key)); 
			});
		}
		function bindControls() {
			$.each([1,2,3], function(idx, layer) {
				$('select[name=key_choice' + layer + '], select[name=chord_choice' + layer + ']').on('change', function() { updateScaleSelector(layer, true) })
				$('select[name=note_choice' + layer + ']').on('change', function() { drawScaleForSelection(layer) })
				$('select[name=text_choice' + layer + ']').on('change', function() { drawScaleForSelection(layer) })
				updateScaleSelector(layer)
			})

			$('select[name=tuning]').on('change', function() { changeTuning(this.value) })

			$('#help').hover(function () {
				$('#guitarneck').hide()	
				$('#keycontrols').hide()	
				$('.instructions').show()	
			}, function() {				
				$('.instructions').hide()	
				$('#guitarneck').show()	
				$('#keycontrols').show()	
			})

			$('.theme_choice').on('change', function() {
				$('body').removeClass()
				$('body').addClass(this.value)
			})
		}

		function changeTuning(tuningName) {
			strings = stringMap[tuningName]
			drawFretboard()
			drawAllSelectedScales()
		}

		function updateScaleSelector(layer, checkForLinkedSelectors) {
				
				var dynamicScaleNameMap,rootNoteElem,rootNoteCode,chordCodeElem,chordCode,selector
				selector = $("[name='note_choice" + layer + "']")
				selector.find('option').remove()

				selector.append('<option value="none">none</option>')

				rootNoteElem = $('.key_choice').filter('[name=key_choice' + layer + ']')[0]
				if (rootNoteElem) { rootNoteCode = rootNoteElem.value }
				chordCodeElem = $('.chord_choice').filter('[name=chord_choice' + layer + ']')[0]
				if (chordCodeElem) { chordCode = chordCodeElem.value  
					$.each(chordScaleMap[chordCode], function(index,entry) {
						var rootNote = parseInt(rootNoteCode) + entry.shift
						while (rootNote >= 12) {
							rootNote -= 12
						}
						selector.append('<option value="' + rootNote + '-' + entry.scale + '">' 
							+ noteNumMap[rootNote] + ' ' + scaleMap[entry.scale]['title'] + '</option>')

					})
				}
				drawScaleForSelection(layer)
				if (checkForLinkedSelectors == true) {
					if ($('input[name=linkChords]').attr('checked') == 'checked') {
						$.each([1,2,3], function(idx, layerNum) {
							if (layerNum != layer) {
								var chosenKeyVal = $('select[name=key_choice' + layer )[0].value
								var chosenChordVal = $('select[name=chord_choice' + layer )[0].value
								$('select[name=key_choice' + layerNum).val(chosenKeyVal)
								$('select[name=chord_choice' + layerNum).val(chosenChordVal)
								updateScaleSelector(layerNum)
							}
						})
					}
 				}
		}
		function drawScaleForSelection(layer) {
			
			var selection,selectionElem = $('select[name=note_choice' + layer + ']')[0],
				textMode, textModeElem = $('select[name=text_choice' + layer + ']')[0]
			if (!selectionElem) { return }
			selection = selectionElem.value
			if (!textModeElem) { 
				textMode = 'note' 
			} else {
				textMode = textModeElem.value
			}
			if (selection == 'none') {
				drawNotes(null,null,null,layer)
			} else {
				var root,scale,components = selection.split('-')
				root = components[0]
				scale = components[1]
				drawScale(scale,textMode,noteNumMap[root],layer)
			}
			
		}

		function drawAllSelectedScales() {
			$.each([1,2,3], function(idx, layer) {
				drawScaleForSelection(layer);
			});
		}

		function drawNotes(scaleMap,textMode,notes,layer) {
				var layerSuffix = 'main'
				if (layer == 2) { 
					layerSuffix = 'second' 
				} else if (layer == 3) {
					layerSuffix = 'third'
				}
				$('.fret_' + layerSuffix).html('');
				if (!scaleMap) { return }
				
				for (var j=0; j<strings.length; j++) {
					var stringStartNote = noteMap[strings[j]] - 1; 
					for(var i=0; i<notes.length; i++) {
						var fret = notes[i] - stringStartNote -1;
						if (fret < 1) { fret = fret + 12; }
						if (fret > 12) { fret = fret - 12; }

						var noteText = noteNumMap[notes[i]];
						if (textMode == nameMode) {
							noteText = scaleMap['names'][i];
						}
						$('#s' + j + '_fret' + fret + ' .fret_' + layerSuffix).html('<p>'+noteText+'</p>');
					}
				}
			}
		
		function drawScale(scaleName, nameMode, baseNote, layer) {
				var baseNotes = scaleMap[scaleName]['notes']
				var semitonesUp = noteMap[baseNote]
				var scaleNotes = []
				for (var i=0; i<baseNotes.length; i++) {
					var note = baseNotes[i] + semitonesUp
					while (note >= 12) {
						note -= 12
					}
					scaleNotes.push(note)
				}
				drawNotes(scaleMap[scaleName], nameMode, scaleNotes, layer)
			}


		return { 

			drawScale : drawScale,
			nameMode : nameMode,
			noteMode : noteMode
		
		}
	})();

});

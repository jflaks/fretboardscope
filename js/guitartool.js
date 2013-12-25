	
var guitartool
$(function(){
	guitartool = (function(){
		var nameMode = "name"
		var noteMode = "note"
		var stringMap = {
			"Standard Guitar" : ['F','C','G','D','A','E'],	
			"Fourths Guitar" : ['F','C','G','D','A','E'],
			"Mandolin" : ['E','A','D','G']		
		}
		var strings = stringMap["Standard Guitar"]

		var template = $('#fret_template').html()
		
		// draw the fretboard
		drawFretboard()
		
		var controltemplate = $('#key_control_template').html()
		for (var i=1; i<4; i++) {
			var elem = Mustache.to_html(controltemplate,{layer: i})
			$('#keycontrols').append(elem)
		}
		
		
		var scaleMap = {
			none : {notes: [], 
				names: [], title: 'None'},
			aeolian : {notes: [0,2,4,5,7,9,11], 
				names: ['1','2','3','4','5','6','7'], title: 'Aeolian / Nat Major'},
			dorian : {notes: [0,2,3,5,7,9,10], 
				names: ['1','2','b3','4','5','6','b7'], title: 'Dorian'},
			phrygian : {notes: [0,1,3,5,7,8,10], 
				names: ['1','b2','b3','4','5','b6','b7'], title: 'Phrygian'},
			lydian : {notes: [0,2,4,6,7,9,11],
				names: ['1','2','3','#4','5','6','7'],  title: 'Lydian'},
			mixolydian : {notes: [0,2,4,5,7,9,10], title: 'Mixolydian'}, 
			ionian : {notes: [0,2,3,5,7,8,10], 
				names: ['1','2','b3','4','5','b6','b7'], title: 'Ionian / Nat Minor'},
			locrian : {notes: [0,1,3,5,6,8,10], 
				names: ['1','b2','b3','4','b5','b6','b7'], title: 'Locrian'},
			min7 : {notes: [0,3,7,10], 
				names: ['1','b3','5','b7'], title: 'Min7 Arp'}  
		};
		var noteMap = { 'C': 0, 'C#':1, 'D':2, 'D#':3, 'E':4, 'F':5, 'F#':6, 'G':7, 'G#':8, 'A':9, 'A#':10, 'B':11 };
		var noteKeys = Object.keys(noteMap);
		var noteNumMap = {};
		for (var i=0; i<noteKeys.length; i++) {
			var noteName = noteKeys[i];
			var noteNum = noteMap[noteName];
			noteNumMap[noteNum] = noteName;
		}
		var scaleKeys = Object.keys(scaleMap);
		var scaleNameMap = {};
		for (var i=0; i<scaleKeys.length; i++) {
			var scaleName = scaleKeys[i];
			var scaleDesc = scaleMap[scaleName].title;
			scaleNameMap[scaleName] = scaleDesc;
		}
		var chordChoiceMap = { 
			key: 'Major key', 
			maj7: 'Major 7', 
			min7: 'Minor 7', 
			dom7: 'Dominant 7'
		}
		var chordScaleMap = {
			key : [ 
				{ shift: 0, scale: 'aeolian'},
				{ shift: 2, scale: 'dorian'},
				{ shift: 4, scale: 'phrygian'},
				{ shift: 5, scale: 'lydian'},
				{ shift: 7, scale: 'mixolydian'},
				{ shift: 9, scale: 'ionian'},
				{ shift: 11, scale: 'locrian'},
			],
			min7 : [],
			maj7 : [
				{ shift : 4, scale: 'min7'},
				{ shift : 9, scale: 'min7'},
				{ shift : 11, scale: 'min7'}],
			dom7 : []

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

		$.each([1,2,3], function(idx, layer) {
			// bind events
			$('select[name=key_choice' + layer + '], select[name=chord_choice' + layer + ']').on('change', function() { updateScaleSelector(layer) })
			$('select[name=note_choice' + layer + ']').on('change', function() { drawScaleForSelection(layer) })
			$('select[name=text_choice' + layer + ']').on('change', function() { drawScaleForSelection(layer) })

			updateScaleSelector(layer)
		})

		function drawFretboard() {
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

		function updateScaleSelector(layer) {
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
						while (rootNote > 12) {
							rootNote -= 12
						}
						selector.append('<option value="' + rootNote + '-' + entry.scale + '">' 
							+ noteNumMap[rootNote] + ' ' + scaleMap[entry.scale]['title'] + '</option>')

					})
				}
				drawScaleForSelection(layer)
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

		function drawNotes(scaleMap,textMode,notes,layer) {
				//var notes = scaleMap['notes'];
				var layerSuffix = 'main'
				if (layer == 2) { 
					layerSuffix = 'second' 
				} else if (layer == 3) {
					layerSuffix = 'third'
				}
				$('.fret_' + layerSuffix).html('');
				if (!scaleMap) { return }
				
				for (var j=0; j<strings.length; j++) {
					var stringStartNote = noteMap[strings[j]] - 1; //can calc once and store
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

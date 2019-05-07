//<reference types="chrome"/>

function cleanText(text) {
	if (!text || text.length === 0) {
		return null;
	}

	return text
		.replace(/[^a-zA-Z ]/g, "")
		.replace(/\s+/g, "")
		.toLowerCase();
}

if (!String.prototype.contains) {
	String.prototype.contains = function(s) {
		return this.indexOf(s) > -1;
	};
}

function cleanUpOverlays() {
	$("div.flow-choice").remove();
}

let allElements = [];

function performAction(context, userInput) {
	switch (context) {
		case "select":
			//Filter function filters out the elements we do not want
			allElements.length = 0;
			allElements = document
				.getElementsByInnerTextRoot(`${userInput}`)
				.filter(element => {
					let rect = element.getBoundingClientRect();
					return !(
						rect.x + rect.width < 0 ||
						rect.y + rect.height < 0 ||
						(rect.x > window.innerWidth || rect.y > window.innerHeight)
					);
				});
			//More than 1 elements found
			if (allElements.length > 1) {
				cleanUpOverlays();
				for (let i = 0; i < allElements.length; i++) {
					let overlay = document.createElement("div");
					overlay.style =
						"font-family: Impact, seif; background-color:yellow; color:black; width: auto; text-align:center; display:inline; border: 2px solid orange; border-radius:8px; left:0 position: absolute; z-index:999";
					overlay.innerText = i;
					overlay.className = "flow-choice";
					allElements[i].appendChild(overlay);
				}
				$("div.flow-choice").toggle("fold", {}, 100);
				$("div.flow-choice").toggle("fold", {}, 500);
			}
			//Exactly 1 element found
			else if (allElements.length == 1) {
				cleanUpOverlays();
				allElements[0].click();
				allElements.length = 0;
			} else {
				console.log("No Element of matching description found");
				return;
			}
			break;
		case "select-followUp":
			if (userInput >= 0 && userInput < allElements.length) {
				cleanUpOverlays();
				allElements[userInput].click();
				allElements.length = 0;
			}
		case "input":
			let inputBar = document.getElementsByInnerTextRoot(null)[0];
			inputBar.value = `${userInput}`;
			inputBar.type = "submit";
			inputBar.click();
			break;
		case "video-playback":
			let videoElement = $("video")[0];
			switch (userInput) {
				case "play":
					videoElement.play();
					break;
				case "pause":
					videoElement.pause();
					break;
				case "mute":
					videoElement.muted = true;
					break;
				case "unmute":
					videoElement.muted = false;
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
}

function getElementsByInnerTextHelper(context, node, userText, matches) {
	switch (context) {
		case "select":
			if (node.nodeType === 1 && node.nodeName !== "SCRIPT") {
				let cleanedNode = cleanText(node.innerText);
				if (cleanedNode && cleanedNode.contains(userText)) {
					matches.push(node);
				}
			}
			break;
		case "input":
			if (node.tagName === "INPUT" && node.outerHTML.contains('type="text"')) {
				matches.push(node);
			}
			break;
		default:
			break;
	}
}

function getAllClickableElements(context, node, userText, matches) {
	switch (context) {
		case "select":
			if (
				node.nodeName == "A" ||
				node.onclick !== null ||
				node.nodeName == "BUTTON"
			) {
				matches.push(node);
			}
			break;
		default:
			break;
	}
}

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(request => {
	let userInput = request.userInput;
	HTMLElement.prototype.getElementsByInnerText = function(textCleaned, escape) {
		let nodes = null;
		nodes = this.querySelectorAll("*");
		console.log(nodes);
		let matches = [];
		if (textCleaned !== null || request.type === "input") {
			for (let i = 0; i < nodes.length; i++) {
				getElementsByInnerTextHelper(
					request.type,
					nodes[i],
					textCleaned,
					matches
				);
			}
		} else {
			for (let i = 0; i < nodes.length; i++) {
				getAllClickableElements(request.type, nodes[i], textCleaned, matches);
			}
			return matches;
		}

		if (escape) {
			return matches;
		}

		let result = [];
		for (let i = 0; i < matches.length; i++) {
			if (matches[i].getElementsByInnerText(textCleaned, true).length === 0) {
				result.push(matches[i]);
			}
		}
		return result;
	};

	HTMLElement.prototype.getElementsByInnerTextRoot = function(text) {
		const textCleaned = cleanText(text);
		let nodes = null;
		nodes = this.querySelectorAll("body");
		console.log(nodes);
		return nodes[0].getElementsByInnerText(textCleaned, false);
	};

	document.getElementsByInnerText =
		HTMLElement.prototype.getElementsByInnerText;

	document.getElementsByInnerTextRoot =
		HTMLElement.prototype.getElementsByInnerTextRoot;

	performAction(request.type, userInput);
});

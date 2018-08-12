// ==UserScript==
// @name         dcard-images
// @namespace    dcard-images
// @version      0.1.0
// @description  Dcard gallery for all images in the article and comments
// @author       Y.Y.
// @match        https://www.dcard.tw/*
// @license      MIT
// @grant        none
// ==/UserScript==

const PubSub = (() => {
	const _events = {};

	function on(event, callback) {
		_events[event] = callback;
	}

	function emit(event) {
		if (_events[event]) {
			_events[event]();
		}
	}

	return {
		on: on,
		emit: emit
	}
})();

(() => {
	const _commentUnit = 30;
	const _galleryBack = document.createElement('div');
	const _galleryImg = document.createElement('img');
	const _galleryTitle = document.createElement('span');
	const _galleryNext = document.createElement('span');
	const _galleryPrev = document.createElement('span');
	const _galleryClose = document.createElement('span');
	let _isOpen = false;
	let _pastURL = '';
	let _images = [];
	let _currentImg = 0;

	_initGallery();
	_handleURLChange();
	_URLCheck();

	function _initGallery() {
		_galleryBack.style.position = 'fixed';
		_galleryBack.style.height = '100vh';
		_galleryBack.style.width = '100vw';
		_galleryBack.style.background = 'rgba(0,0,0,.9)';
		_galleryBack.style.zIndex = '20020';
		_galleryBack.style.display = 'none';

		_galleryImg.style.objectFit = 'contain';
		_galleryImg.style.height = '100%';
		_galleryImg.style.width = '100%';

		_galleryTitle.style.position = 'absolute';
		_galleryTitle.style.top = '20px';
		_galleryTitle.style.left = '20px';
		_galleryTitle.style.background = '#f3f3f3';
		_galleryTitle.style.display = 'inline-block';
		_galleryTitle.style.padding = '5px 20px';
		_galleryTitle.style.borderRadius = '20px';
		_galleryTitle.style.fontWeight = 'bold';

		_galleryNext.innerText = '>';
		_galleryNext.style.position = 'absolute';
		_galleryNext.style.right = '5vw';
		_galleryNext.style.top = '45vh';
		_galleryNext.style.fontSize = '60px';
		_galleryNext.style.color = '#f3f3f3';
		_galleryNext.style.cursor = 'pointer';
		_galleryNext.addEventListener('click', _handleNext);

		_galleryPrev.innerText = '<';
		_galleryPrev.style.position = 'absolute';
		_galleryPrev.style.left = '5vw';
		_galleryPrev.style.top = '45vh';
		_galleryPrev.style.fontSize = '60px';
		_galleryPrev.style.color = '#f3f3f3';
		_galleryPrev.style.cursor = 'pointer';
		_galleryPrev.addEventListener('click', _handlePrev);

		_galleryClose.innerHTML = '&times;';
		_galleryClose.style.position = 'absolute';
		_galleryClose.style.top = '20px';
		_galleryClose.style.right = '30px';
		_galleryClose.style.background = 'red';
		_galleryClose.style.color = '#f3f3f3';
		_galleryClose.style.fontSize = '30px';
		_galleryClose.style.padding = '5px';
		_galleryClose.style.lineHeight = '16px';
		_galleryClose.style.borderRadius = '20px';
		_galleryClose.style.cursor = 'pointer';
		_galleryClose.addEventListener('click', _handleClose);

		_galleryBack.appendChild(_galleryImg);
		_galleryBack.appendChild(_galleryTitle);
		_galleryBack.appendChild(_galleryNext);
		_galleryBack.appendChild(_galleryPrev);
		_galleryBack.appendChild(_galleryClose);
		document.getElementById('root').appendChild(_galleryBack);

		document.body.addEventListener('keydown', function (e) {
			if (_isOpen) {
				switch (e.which) {
					case 27:
						_handleClose();
						break;
					case 37:
						_handlePrev();
						break;
					case 39:
						_handleNext();
						break;
				}
			}
		});
	}

	function _URLCheck() {
		setInterval(() => {
			if (_pastURL !== location.href) {
				_pastURL = location.href;
				PubSub.emit('URLChange');
			}
		}, 900);
	}

	function _handleURLChange() {
		PubSub.on('URLChange', () => {
			if (!!document.querySelectorAll('link[rel=canonical]')[0].href.match(/\/(\d*$)/)) {
				const btn = document.createElement('button');
				btn.innerText = '瀏覽圖片';
				btn.style.fontSize = '12px';
				btn.style.lineHeight = '12px';
				btn.addEventListener('click', _handleClick);
				document.querySelectorAll('article>div>div>h2')[0].appendChild(btn);
			}
		});
	}

	function _handleClick() {
		_images = [];
		let postID;
		if (!!document.querySelectorAll('link[rel=canonical]')[0].href.match(/\/(\d*$)/)) {
			postID = document.querySelectorAll('link[rel=canonical]')[0].href.match(/\/(\d*$)/)[1];
			fetch(`/_api/posts/${ postID }?`).then(res => res.json()).then(data => {
				data.media.forEach(m => {
					_images.push({
						floor: 0,
						imgHash: m.url.match(/http[s]?:\/\/i\.imgur\.com\/([A-Za-z0-9]*)\.jpg/)[1]
					});
				});

				Promise.all([...new Array(Math.ceil(data.commentCount / _commentUnit))].map((val, i) => {
					return new Promise((resolve) => {
						fetch(`/_api/posts/${ postID }/comments?after=${ i * _commentUnit }`).then(res => {
							if (res.ok) {
								return res.json();
							} else {
								return Promise.resolve([]);
							}
						}).then(resolve)
					});
				})).then((commentSetArr) => {
					commentSetArr.forEach((comments) => {
						comments.forEach((comment) => {
							const regex = /http[s]?:\/\/i\.imgur\.com\/([A-Za-z0-9]*)\.jpg/g;
							const content = comment.content;
							let match;
							while (match = regex.exec(content)) {
								_images.push({
									floor: comment.floor,
									imgHash: match[1]
								});
							}
						});
					});

					_renderGallery();
				});
			});
		}
	}

	function _renderGallery() {
		if (!_images.length) {
			return;
		}

		_isOpen = true;
		_galleryBack.style.display = 'block';
		_currentImg = 0;
		_renderImage(_currentImg);
	}

	function _renderImage(index) {
		_galleryImg.setAttribute('src', `https://imgur.dcard.tw/${ _images[index].imgHash }.jpg`);
		_galleryTitle.innerText = `B${ _images[index].floor } - ${ index + 1 }/${ _images.length }`;
	}

	function _handleNext() {
		_currentImg++;
		if (!_images[_currentImg]) {
			_currentImg = 0;
		}

		_renderImage(_currentImg);
	}

	function _handlePrev() {
		_currentImg--;
		if (_currentImg < 0) {
			_currentImg = _images.length - 1;
		}

		_renderImage(_currentImg);
	}

	function _handleClose() {
		_isOpen = false;
		_galleryBack.style.display = 'none';
	}
})();

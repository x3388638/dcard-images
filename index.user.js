// ==UserScript==
// @name         dcard-images
// @namespace    https://2yc.tw
// @version      0.1.0
// @description  Dcard gallery for all images in the article and comments
// @author       Y.Y.
// @match        https://www.dcard.tw/*
// @license      MIT
// @homepage     https://github.com/x3388638/dcard-images
// @updateURL    https://openuserjs.org/meta/x3388638/dcard-images.meta.js
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
		on,
		emit
	}
})();

(() => {
	const _scripts = [
		'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js'
	];
	const _commentUnit = 30;
	const _galleryBack = document.createElement('div');
	const _galleryImg = document.createElement('img');
	const _galleryNum = document.createElement('span');
	const _galleryTitle = document.createElement('span');
	const _galleryNext = document.createElement('span');
	const _galleryPrev = document.createElement('span');
	const _galleryClose = document.createElement('span');
	let _isOpen = false;
	let _pastURL = '';
	let _images = [];
	let _currentImg = 0;

	window.onload = function () {
		_addScript();
		_addStyle();
		_initGallery();
		_handleURLChange();
		_URLCheck();
	}

	function _addScript() {
		_scripts.forEach((s) => {
			const script = document.createElement('script');
			script.src = s;
			document.getElementById('root').appendChild(script);
		});
	}

	function _addStyle() {
		const style = document.createElement('style');
		style.innerHTML = `
			.DcardImages__close {
				position: absolute;
				top: 20px;
				right: 30px;
				color: rgb(243, 243, 243);
				font-size: 24px;
				padding: 5px;
				line-height: 12px;
				cursor: pointer;
			}

			.DcardImages__close:hover {
				color: red;
			}

			.DcardImages__galleryBack {
				position: fixed;
				height: 100vh;
				width: 100vw;
				background: rgba(0,0,0,.9);
				z-index: 20020;
				display: none;
			}

			.DcardImages__img {
				object-fit: contain;
				height: 100%;
				width: 100%
			}

			.DcardImages__num {
				position: absolute;
				top: 20px;
				left: 20px;
				color: #f3f3f3;
				display: inline-block;
				border-radius: 20px;
				font-weight: bold;
			}

			.DcardImages__title {
				position: absolute;
				top: 60px;
				left: 0;
				background: #fafafab3;
				display: inline-block;
				padding: 5px 20px;
				font-weight: bold;
			}

			.DcardImages__nextBtn {
				position: absolute;
				right: 5vw;
				top: 45vh;
				font-size: 60px;
				color: #f3f3f3;
				cursor: pointer;
				opacity: 0.1
			}

			.DcardImages__prevBtn {
				position: absolute;
				left: 5vw;
				top: 45vh;
				font-size: 60px;
				color: #f3f3f3;
				cursor: pointer;
				opacity: 0.1
			}

			.DcardImages__nextBtn:hover,
			.DcardImages__prevBtn:hover {
				opacity: 1;
			}
		`;

		document.getElementById('root').appendChild(style);
	}

	function _initGallery() {
		_galleryBack.setAttribute('class', 'DcardImages__galleryBack');
		_galleryImg.setAttribute('class', 'DcardImages__img');
		_galleryNum.setAttribute('class', 'DcardImages__num');
		_galleryTitle.setAttribute('class', 'DcardImages__title');

		_galleryNext.setAttribute('class', 'DcardImages__nextBtn');
		_galleryNext.innerText = '〉';
		_galleryNext.addEventListener('click', _handleNext);

		_galleryPrev.setAttribute('class', 'DcardImages__prevBtn');
		_galleryPrev.innerText = '〈';
		_galleryPrev.addEventListener('click', _handlePrev);

		_galleryClose.innerHTML = '&times;';
		_galleryClose.setAttribute('class', 'DcardImages__close');
		_galleryClose.addEventListener('click', _handleClose);

		_galleryBack.appendChild(_galleryImg);
		_galleryBack.appendChild(_galleryNum);
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
			if (!!document.querySelectorAll('link[rel=canonical]')[0].href.match(/\/(\d*$)/) &&
				!document.querySelectorAll('.DcardImages__showGalleryBtn').length) {
				const btn = document.createElement('button');
				btn.setAttribute('class', 'DcardImages__showGalleryBtn');
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
						createdAt: data.createdAt,
						school: data.school || '匿名',
						department: data.department || '',
						gender: data.gender,
						imgHash: m.url.match(/http[s]?:\/\/i\.imgur\.com\/([A-Za-z0-9]*)\.[jpg|png]/)[1]
					});
				});

				console.log(_images);

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
							const regex = /http[s]?:\/\/i\.imgur\.com\/([A-Za-z0-9]*)\.[jpg|png]/g;
							let match;
							while (match = regex.exec(comment.content)) {
								_images.push({
									floor: comment.floor,
									host: comment.host ? '原PO - ' : '',
									createdAt: comment.createdAt,
									school: comment.school || '匿名',
									department: comment.department || '',
									gender: comment.gender,
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
		_galleryNum.innerText = `${ index + 1 }/${ _images.length }`;
		_galleryTitle.innerHTML = `
			${ _images[index].host || '' }${ _images[index].school } ${ _images[index].department }<br />
			B${ _images[index].floor } | ${ moment(_images[index].createdAt).utc(8).format('M月DD日 HH:mm') }
		`;
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

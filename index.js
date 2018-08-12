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
	let _pastURL = '';
	let _images = [];

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

		document.getElementById('root').appendChild(_galleryBack);
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
				btn.setAttribute('class', 'btn-dcardImages');
				btn.style.fontSize = '12px';
				btn.style.lineHeight = '12px';
				btn.addEventListener('click', _handleClick);
				document.querySelectorAll('article>div>div>h2')[0].appendChild(btn);
			}
		});
	}

	function _handleClick() {
		let postID;
		if (!!document.querySelectorAll('link[rel=canonical]')[0].href.match(/\/(\d*$)/)) {
			postID = document.querySelectorAll('link[rel=canonical]')[0].href.match(/\/(\d*$)/)[1];
			fetch(`/_api/posts/${ postID }?`).then(res => res.json()).then(data => {
				data.media.forEach(m => {
					_images.push({
						floor: 0,
						img: m.url
					});
				});

				Promise.all([...new Array(Math.ceil(data.commentCount / _commentUnit))].map((val, i) => {
					return new Promise((resolve) => {
						fetch(`/_api/posts/${postID}/comments?after=${i * _commentUnit}`).then(res => res.json()).then(resolve)
					});
				})).then((commentSetArr) => {
					commentSetArr.forEach((comments) => {
						comments.forEach((comment) => {
							const match = comment.content ? comment.content.match(/https:\/\/i\.imgur\.com\/[A-Za-z0-9]*\.jpg/) : null;
							if (!!match) {
								_images.push({
									floor: comment.floor,
									img: match[0]
								})
							}
						})
					});

					_renderGallery();
				});
			});
		}
	}

	function _renderGallery() {
		console.log(_images);
		_galleryBack.style.display = 'block';
	}
})();
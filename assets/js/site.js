/* Birthday surprise - plain JavaScript. No frameworks, no build step. */
;(function () {
  'use strict'

  var data = window.SITE
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function el(tag, className) {
    var node = document.createElement(tag)
    if (className) node.className = className
    return node
  }

  /* -------------------------------- footer text -------------------------------- */

  function initFooter() {
    var target = document.querySelector('[data-footer-text]')
    if (target) target.textContent = data.footerText
  }

  /* -------------------------------- navigation -------------------------------- */

  function initNavbar() {
    var toggle = document.querySelector('.nav-toggle')
    var menu = document.getElementById('mobile-menu')
    if (!toggle || !menu) return

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true'
      toggle.setAttribute('aria-expanded', String(!open))
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu')
      menu.classList.toggle('is-open', !open)
    })
  }

  /* -------------------------------- decorations -------------------------------- */

  var particleEmojis = ['✨', '🌸', '🎈', '⭐', '💐', '🎂', '🤍']

  function initParticles(count) {
    var layer = document.querySelector('.particles')
    if (!layer || reduceMotion) return

    for (var i = 0; i < count; i += 1) {
      var span = el('span', 'particle')
      span.textContent = particleEmojis[i % particleEmojis.length]
      span.style.left = Math.random() * 100 + '%'
      span.style.fontSize = 12 + Math.random() * 16 + 'px'
      span.style.animationDelay = Math.random() * 12 + 's'
      span.style.animationDuration = 16 + Math.random() * 14 + 's'
      layer.appendChild(span)
    }
  }

  var confettiColors = ['#ff8ab5', '#b39cf7', '#9fe8d3', '#ffd166', '#ffb3cf', '#8ecae6']

  function fireConfetti(pieces, lifetime) {
    var layer = document.querySelector('.confetti-layer')
    if (!layer || reduceMotion) return

    layer.textContent = ''
    for (var i = 0; i < pieces; i += 1) {
      var piece = el('span', 'confetti-piece')
      piece.style.left = Math.random() * 100 + '%'
      piece.style.width = 6 + Math.random() * 6 + 'px'
      piece.style.height = 10 + Math.random() * 10 + 'px'
      piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      piece.style.borderRadius = Math.random() > 0.65 ? '9999px' : '2px'
      piece.style.animationDelay = Math.random() * 2.5 + 's'
      piece.style.animationDuration = 3.5 + Math.random() * 3 + 's'
      layer.appendChild(piece)
    }

    window.setTimeout(function () {
      layer.textContent = ''
    }, lifetime)
  }

  /* -------------------------------- back to top -------------------------------- */

  function initBackToTop() {
    var button = document.querySelector('.back-to-top')
    if (!button) return

    function update() {
      button.classList.toggle('is-visible', window.scrollY > 320)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  /* -------------------------------- music (manual only) -------------------------------- */

  function initMusic() {
    var button = document.querySelector('.music-button')
    if (!button) return

    var audio = new Audio()
    audio.loop = true
    audio.preload = 'metadata'

    audio.addEventListener('loadedmetadata', function () {
      button.hidden = false
    })

    audio.addEventListener('ended', function () {
      button.setAttribute('aria-pressed', 'false')
    })

    audio.src = data.musicSrc
    audio.load()

    button.addEventListener('click', function () {
      var playing = button.getAttribute('aria-pressed') === 'true'
      if (playing) {
        audio.pause()
        button.setAttribute('aria-pressed', 'false')
        button.setAttribute('aria-label', 'Play birthday music')
        return
      }
      var started = audio.play()
      if (started && typeof started.then === 'function') {
        started
          .then(function () {
            button.setAttribute('aria-pressed', 'true')
            button.setAttribute('aria-label', 'Pause birthday music')
          })
          .catch(function () {
            /* Playback was blocked - keep the button in its paused state. */
          })
      }
    })
  }

  /* -------------------------------- home page -------------------------------- */

  function initHome() {
    var hero = document.querySelector('.hero')
    var surprise = document.querySelector('[data-surprise]')
    var more = document.querySelector('[data-more-confetti]')

    fireConfetti(70, 6000)

    if (more) {
      more.addEventListener('click', function () {
        fireConfetti(70, 6000)
      })
    }

    if (surprise) {
      surprise.addEventListener('click', function () {
        fireConfetti(90, 6000)
        if (hero) hero.classList.add('is-opening')
        window.setTimeout(function () {
          window.location.href = 'memories.html'
        }, 900)
      })
    }
  }

  /* -------------------------------- memories page -------------------------------- */

  function initMemories() {
    var grid = document.querySelector('[data-gallery]')
    if (!grid) return

    var photos = data.photos
    var current = 0

    var lightbox = document.querySelector('.lightbox')
    /* Keep the dialog out of any animated ancestor so `position: fixed` stays viewport-based. */
    document.body.appendChild(lightbox)
    var lightboxImage = lightbox.querySelector('[data-lightbox-image]')
    var lightboxCaption = lightbox.querySelector('[data-lightbox-caption]')

    photos.forEach(function (photo, index) {
      var card = el('button', 'photo-card')
      card.type = 'button'
      card.setAttribute('aria-label', 'Open larger view: ' + photo.alt)
      card.style.animationDelay = index * 110 + 'ms'

      var frame = el('div', 'photo-frame')
      var image = el('img')
      image.src = photo.src
      image.alt = photo.alt
      image.loading = 'lazy'
      image.addEventListener('error', function () {
        var placeholder = el('div', 'photo-placeholder')
        placeholder.innerHTML =
          '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>' +
          '<circle cx="12" cy="13" r="3"/></svg>' +
          '<p class="placeholder-title"></p><p class="placeholder-hint">Add <strong></strong> to the images folder</p>'
        placeholder.querySelector('.placeholder-title').textContent = photo.alt
        placeholder.querySelector('.placeholder-hint strong').textContent = photo.src.replace(
          'images/',
          '',
        )
        frame.replaceChild(placeholder, image)
      })
      frame.appendChild(image)

      var caption = el('p', 'photo-caption')
      caption.innerHTML =
        '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>' +
        '<span></span>'
      caption.querySelector('span').textContent = photo.alt

      card.appendChild(frame)
      card.appendChild(caption)
      card.addEventListener('click', function () {
        openLightbox(index)
      })
      grid.appendChild(card)
    })

    function show(index) {
      current = (index + photos.length) % photos.length
      var photo = photos[current]
      lightboxImage.src = photo.src
      lightboxImage.alt = photo.alt
      lightboxImage.style.display = ''
      lightboxCaption.textContent = photo.alt
      lightbox.setAttribute('aria-label', photo.alt)
    }

    function openLightbox(index) {
      show(index)
      lightbox.hidden = false
      document.body.style.overflow = 'hidden'
      lightbox.querySelector('.lightbox-close').focus()
    }

    function closeLightbox() {
      lightbox.hidden = true
      document.body.style.overflow = ''
    }

    lightboxImage.addEventListener('error', function () {
      lightboxImage.style.display = 'none'
    })

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox()
    })
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox)
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
      show(current - 1)
    })
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
      show(current + 1)
    })

    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowRight') show(current + 1)
      if (event.key === 'ArrowLeft') show(current - 1)
    })
  }

  /* -------------------------------- birthday wish page -------------------------------- */

  function initBirthdayWish() {
    var container = document.querySelector('[data-typing]')
    if (!container) return

    var heading = document.querySelector('[data-wish-heading]')
    if (heading) heading.textContent = data.birthdayWish.heading

    var paragraphs = data.birthdayWish.paragraphs

    if (reduceMotion) {
      paragraphs.forEach(function (text) {
        var node = el('p')
        node.textContent = text
        container.appendChild(node)
      })
      return
    }

    var speed = 22
    var index = 0

    function typeParagraph() {
      if (index >= paragraphs.length) return
      var text = paragraphs[index]
      var node = el('p')
      var textNode = document.createTextNode('')
      var caret = el('span', 'typing-caret')
      node.appendChild(textNode)
      node.appendChild(caret)
      container.appendChild(node)

      var position = 0
      var timer = window.setInterval(function () {
        position += 1
        textNode.nodeValue = text.slice(0, position)
        if (position >= text.length) {
          window.clearInterval(timer)
          node.removeChild(caret)
          index += 1
          window.setTimeout(typeParagraph, 450)
        }
      }, speed)
    }

    typeParagraph()
  }

  /* -------------------------------- apology page -------------------------------- */

  function initApology() {
    var container = document.querySelector('[data-apology]')
    if (!container) return

    var heading = document.querySelector('[data-apology-heading]')
    if (heading) heading.textContent = data.apology.heading

    data.apology.paragraphs.forEach(function (text, index) {
      var node = el('p')
      node.textContent = text
      node.style.animationDelay = index * 180 + 'ms'
      container.appendChild(node)
    })

    var closing = document.querySelector('[data-apology-closing]')
    if (closing) {
      closing.querySelector('.gradient-text').textContent = data.apology.closingLine
      closing.querySelector('[data-emojis]').textContent = data.apology.closingEmojis
    }
  }

  /* -------------------------------- boot -------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    initFooter()
    initNavbar()
    initParticles(14)
    initBackToTop()
    initMusic()

    var page = document.body.getAttribute('data-page')
    if (page === 'home') initHome()
    if (page === 'memories') initMemories()
    if (page === 'birthday-wish') initBirthdayWish()
    if (page === 'apology') initApology()
  })
})()

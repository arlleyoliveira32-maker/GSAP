$(function () {
    'use strict';

    let piecesMounted = 0;

    // 1. MONTAGEM EXCLUSIVA VIA CLIQUE (CLICK)
    $('.puzzle-piece').on('click', function () {
        if (!$(this).hasClass('active')) {$(this).addClass('active');
            piecesMounted++;

            const pieceNum = $(this).data('piece');

            // Atualiza o painel superior mostrando o texto de mercado correspondente
            $('.text-step-content').removeClass('active');$(`.text-step-content[data-step="${pieceNum}"]`).addClass('active');

            if (piecesMounted === 4) {
                setTimeout(function () {
                    // Esconde o painel superior e expande o quadro para TELA CHEIA LIMPA
                    $('#puzzle-header-text').css('opacity', '0');
                    $('#puzzle-text-display').css('opacity', '0');
                    $('#puzzle-container').addClass('fullscreen');
                    $('#puzzle-status').removeClass('hidden');

                    // 10 Segundos de contemplação em tela cheia da imagem montada
                    setTimeout(function () {
                        gsap.to('#puzzle-intro', {
                            opacity: 0,
                            display: 'none',
                            duration: 1.2,
                            onComplete: function () {
                                $('#main-site').removeClass('hidden');
                                gsap.from('#main-site', { opacity: 0, duration: 1 });
                                initLenisAndGSAP();
                            }
                        });
                    }, 10000);

                }, 8000);
            }
        }
    });

    // 2. UNIVERSO DE SERVIÇOS ANIMADO COM GSAP
    $('.btn-universe').on('click', function () {
        const index = $(this).data('target');
        
        $('.btn-universe').removeClass('active');$(this).addClass('active');

        const currentActive = $('.service-card-item.active');
        const nextTarget = $(`.service-card-item[data-index="${index}"]`);

        if (!nextTarget.hasClass('active')) {
            gsap.to(currentActive, {
                opacity: 0,
                y: -15,
                duration: 0.3,
                onComplete: function () {
                    currentActive.removeClass('active').css({ visibility: 'hidden' });
                    
                    gsap.fromTo(nextTarget, 
                        { opacity: 0, y: 15, visibility: 'visible' },
                        { opacity: 1, y: 0, duration: 0.4, onComplete: function() {
                            nextTarget.addClass('active');
                        }}
                    );
                }
            });
        }
    });

    // 3. EFEITO DE REVELAÇÃO DA FOTO IGUAL AO PROFESSOR (GRANDES MENTES)
    const hoverPop = $('#hover-image-pop');
    const popImg = $('#pop-img-src');

    $('.mente-pure-item').on('mouseenter', function () {
        const imgSrc = $(this).data('img');
        popImg.attr('src', imgSrc);
        hoverPop.addClass('active');
    }).on('mouseleave', function () {
        hoverPop.removeClass('active');
    }).on('mousemove', function (e) {
        // Segue o cursor
        hoverPop.css({
            top: e.clientY - 100 + 'px',
            left: e.clientX + 30 + 'px'
        });
    });

    // 4. INTERAÇÃO 3D REAL NO PRODUTO LIVRE (SEM FEIXE DE LUZ)
    const spotlightStage = document.getElementById('spotlight-box');
    const floatingProduct = document.getElementById('floating-product');

    if (spotlightStage && floatingProduct) {
        spotlightStage.addEventListener('mousemove', (e) => {
            if ($('#spotlight-box').hasClass('mode-with-davinci')) {
                const rect = spotlightStage.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Inclinação e Rotação 3D interativa sob o cursor
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -18;
                const rotateY = ((x - centerX) / centerX) * 18;

                floatingProduct.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        spotlightStage.addEventListener('mouseleave', () => {
            floatingProduct.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }

    // BOTÕES DE ALTERNÂNCIA (POSICIONAMENTO PREMIUM / ANÚNCIO COMUM)
    $('#btn-with-davinci').on('click', function () {
        $('.btn-toggle').removeClass('active');$(this).addClass('active');

        $('#spotlight-box')
            .removeClass('mode-without-davinci')
            .addClass('mode-with-davinci');

        $('#light-instruction-text').text('Mova o mouse sobre o produto para explorar a física de rotação 3D e o reflexo de iluminação de estúdio.');
    });

    $('#btn-without-davinci').on('click', function () {
        $('.btn-toggle').removeClass('active');$(this).addClass('active');

        $('#spotlight-box')
            .removeClass('mode-with-davinci')
            .addClass('mode-without-davinci');

        $('#light-instruction-text').text('Anúncio comum de prateleira: O produto fica opaco, plano, sem atrativo e brigando pelo menor preço.');
    });

    // 5. LENIS + GSAP SCROLLTRIGGER
    function initLenisAndGSAP() {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({ duration: 1.2, smooth: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));

        const container = document.querySelector('.horizontal-wrapper');

        gsap.to(container, {
            x: () => -(container.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-section",
                pin: true,
                scrub: 1,
                end: () => "+=" + container.scrollWidth
            }
        });
    }
});
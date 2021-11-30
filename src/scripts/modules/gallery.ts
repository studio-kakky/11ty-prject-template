interface Image {
  src: string;
  caption?: string;
}

export class ImageGallery {
  private currentNum = 1;
  private readonly el: HTMLElement;
  private defaultLeftPosition: string;
  constructor(private imageList: Image[], private container: HTMLElement) {
    this.defaultLeftPosition = `${(imageList.length + 1) * 100}%`;
    this.el = this.getEl();
    this.container.appendChild(this.el);
    this.prepareNav();
    this.render();

    this.el.style.left = this.defaultLeftPosition;
    this.el.style.opacity = '0';
  }

  show(index = 1): void {
    this.currentNum = index;
    this.render();

    this.el.style.left = '0';
    this.el.style.opacity = '1';
  }

  close(): void {
    this.currentNum = 1;
    this.el.style.opacity = '0';
    setTimeout(() => {
      this.el.style.left = this.defaultLeftPosition;
    }, 500);
  }

  private prepareNav(): void {
    const nextBtn = this.el.querySelector('#slideNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.next();
      });
    }

    const previousBtn = this.el.querySelector('#slidePrevious');
    if (previousBtn) {
      previousBtn.addEventListener('click', () => {
        this.previous();
      });
    }

    const closeBtn = this.el.querySelector('#slideClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }
  }

  private next(): void {
    this.currentNum =
      this.currentNum < this.imageList.length
        ? this.currentNum + 1
        : this.currentNum;

    this.render();
  }

  private previous(): void {
    this.currentNum =
      this.currentNum > 1 ? this.currentNum - 1 : this.currentNum;

    this.render();
  }

  private render() {
    const listEl = this.el.querySelector('.SlideList') as HTMLElement;
    if (listEl) {
      listEl.style.left = `${-(this.currentNum - 1) * 100}%`;
    }

    this.setDisabledNext();
    this.setDisabledPrevious();
  }

  private setDisabledNext(): void {
    const nextBtn = this.el.querySelector('#slideNext');
    if (!nextBtn) {
      return;
    }

    if (this.currentNum < this.imageList.length) {
      nextBtn.removeAttribute('disabled');
      return;
    }

    nextBtn.setAttribute('disabled', '');
  }

  private setDisabledPrevious(): void {
    const previousBtn = this.el.querySelector('#slidePrevious');
    if (!previousBtn) {
      return;
    }

    if (this.currentNum > 1) {
      previousBtn.removeAttribute('disabled');
      return;
    }

    previousBtn.setAttribute('disabled', '');
  }

  private getEl(): HTMLElement {
    const el = document.createElement('div');
    el.classList.add('Slideshow');

    const body = `
  <button class="SlideClose" id="slideClose" area-label="閉じる"><span class="material-icons-outlined" aria-hidden="true">close</span></button>
  <div class="SlidesBody">
    <ul class="SlideList" style="width: ${this.imageList.length * 100}%;left: ${
      -(this.currentNum - 1) * 100
    }%">
      ${this.imageList
        .map((v) => `<li class="Slide"><img src="${v.src}" alt=""></li>`)
        .join('\n')}
    </ul>
  </div>
  <div class="SlideNav">
    <button class="SlideBtn" id="slidePrevious" area-label="前へ戻る"><span class="material-icons-outlined" aria-hidden="true">arrow_back_ios</span></button>
    <button class="SlideBtn" id="slideNext" area-label="次へすすむ"><span class="material-icons-outlined" aria-hidden="true">arrow_forward_ios</span></button>
  </div>
    `;

    el.insertAdjacentHTML('beforeend', body);
    return el;
  }
}

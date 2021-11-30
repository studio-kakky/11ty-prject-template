import { YoutubeOption } from '../constants';
import Player = YT.Player;

interface ExtendedWindow extends Window {
  onYouTubeIframeAPIReady(): void;
}
declare const window: ExtendedWindow;

const loadScript = (): Promise<void> => {
  const scriptTag = document.createElement('script');
  scriptTag.src = 'https://www.youtube.com/iframe_api';
  const head = document.querySelector('head') as HTMLElement;
  head.append(scriptTag);

  return new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
};

const prepareOnResize = (player: Player, option: YoutubeOption) => {
  const size = getAdjustedSize(option);
  player.setSize(size.width, size.height);

  window.addEventListener('resize', () => {
    const adjustedSize = getAdjustedSize(option);
    player.setSize(adjustedSize.width, adjustedSize.height);
  });
};

const getAdjustedSize = (
  option: YoutubeOption
): { width: number; height: number } => {
  const width = window.innerWidth;
  const height = option.height * (width / option.width);
  return { width, height };
};

export const embedMovie = async (
  wrapper: HTMLElement,
  container: HTMLElement,
  option: YoutubeOption
): Promise<void> => {
  await loadScript();
  const size = getAdjustedSize(option);
  wrapper.setAttribute('height', size.height.toString());
  wrapper.setAttribute('width', size.width.toString());

  const player = new YT.Player(container, {
    height: size.height,
    width: size.width,
    videoId: option.id,
    playerVars: {
      controls: 1,
      rel: 0,
    },
    events: {
      onReady: () => {
        player.mute();
        player.playVideo();
        prepareOnResize(player, option);
        setTimeout(() => {
          wrapper.classList.remove('-hide');
        }, 1000);
      },
    },
  });
};

import React, {PropTypes} from 'react';

const FerrisWheelPreloader = () => {

  return (
    <svg
      id="ferris-wheel-preloader"
      className="ferris-wheel-preloader-class"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 233.7 182.7"
      style={{enableBackground:"new 0 0 233.7 182.7"}}
      xmlSpace="preserve">

      <style>
        {
          `.cloud1,.cloud2{fill:#FFFFFF;}
          .wheel{fill:#53A800;}
          .foot{fill:none;stroke:#FFFFFF;stroke-width:10;stroke-miterlimit:10;}
          @keyframes floating {
            0% {
              transform: translateX(0px);
            }
            50% {
              transform: translateX(10px);
            }
            100% {
              transform: translateX(0px);
            }
          }

          @keyframes rotating {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(180deg);
            }
          }

          .cloud1 {
            animation: floating 3s infinite;
            animation-delay: -1s;
          }

          .cloud2 {
            animation: floating 3s infinite;
            animation-delay: -2s;
          }

          .wheel {
            transform-origin: 50% 50%;
            animation: rotating 3s linear infinite;
            animation-delay: -2s;
          }
          `
        }
      </style>

      <path className="cloud1" d="M72.1,43.2c-1.6-7.4-8.2-13-16.1-13c-2.3,0-4.5,0.5-6.4,1.3c-2.9-4.6-8.1-7.7-13.9-7.7
        c-9.1,0-16.5,7.4-16.5,16.5c0,1.1,0.1,2.1,0.3,3.1C12,45.1,6.5,51.7,6.5,59.5C6.5,68.6,13.9,76,23,76h46.6c9.1,0,16.5-7.4,16.5-16.5
        C86.1,51.3,80,44.4,72.1,43.2z"/>
      <path className="wheel" d="M173.7,76c0-8.4-1.6-16.5-4.5-23.9c2.5-3.3,2.9-7.9,0.7-11.7c-2.2-3.8-6.4-5.7-10.5-5.3
        c-10.1-12.6-24.7-21.4-41.4-23.9c-1.6-3.8-5.4-6.4-9.8-6.4s-8.1,2.6-9.8,6.4C81.7,13.7,67.1,22.5,57,35.1c-4.1-0.5-8.3,1.5-10.5,5.3
        c-2.2,3.8-1.8,8.4,0.7,11.7c-2.9,7.4-4.5,15.5-4.5,23.9c0,8.4,1.6,16.5,4.5,23.9c-2.5,3.3-2.9,7.9-0.7,11.7
        c2.2,3.8,6.4,5.7,10.5,5.3c10.1,12.6,24.7,21.4,41.4,23.9c1.6,3.8,5.4,6.4,9.8,6.4c4.4,0,8.1-2.6,9.8-6.4
        c16.7-2.5,31.3-11.3,41.4-23.9c4.1,0.5,8.3-1.5,10.5-5.3c2.2-3.8,1.8-8.4-0.7-11.7C172.1,92.5,173.7,84.5,173.7,76z M117.2,21.2
        c13.6,2.2,25.6,9.4,34,19.6c-1.2,2.4-1.5,5.2-0.8,7.9l-5,2.9c-7.5-11.5-20.2-19.3-34.8-20.1v-5.7C113.4,25.2,115.7,23.5,117.2,21.2z
         M147.7,76c0,6.3-1.5,12.3-4.1,17.6L113.2,76l30.4-17.6C146.2,63.7,147.7,69.7,147.7,76z M68.6,76c0-6.3,1.5-12.3,4.1-17.6L103.2,76
        L72.7,93.6C70.1,88.3,68.6,82.3,68.6,76z M105.7,71.7L75.2,54.1c6.7-10,17.7-16.8,30.4-17.6V71.7z M105.7,80.4v35.1
        c-12.7-0.8-23.8-7.6-30.4-17.6L105.7,80.4z M110.7,80.4l30.4,17.6c-6.7,10-17.7,16.8-30.4,17.6V80.4z M110.7,71.7V36.5
        c12.7,0.8,23.8,7.6,30.4,17.6L110.7,71.7z M99.2,21.2c1.5,2.3,3.8,4,6.5,4.6v5.7c-14.5,0.8-27.2,8.6-34.8,20.1l-5-2.9
        c0.8-2.7,0.5-5.5-0.8-7.9C73.6,30.6,85.6,23.4,99.2,21.2z M56.2,56.4c2.7-0.1,5.3-1.3,7.3-3.3l5,2.9c-3.1,6-4.8,12.9-4.8,20.1
        s1.7,14,4.8,20.1l-5,2.9c-1.9-2-4.5-3.2-7.3-3.3c-2.3-6.1-3.6-12.7-3.6-19.6C52.6,69.1,53.9,62.5,56.2,56.4z M99.2,130.8
        c-13.6-2.2-25.6-9.4-34-19.6c1.2-2.4,1.5-5.2,0.8-7.9l5-2.9c7.5,11.5,20.2,19.3,34.8,20.1v5.7C103,126.9,100.6,128.6,99.2,130.8z
         M117.2,130.8c-1.5-2.3-3.8-4-6.5-4.6v-5.7c14.5-0.8,27.2-8.6,34.8-20.1l5,2.9c-0.8,2.7-0.5,5.5,0.8,7.9
        C142.7,121.4,130.8,128.6,117.2,130.8z M160.1,95.6c-2.7,0.1-5.3,1.3-7.3,3.3l-5-2.9c3.1-6,4.8-12.9,4.8-20.1s-1.7-14-4.8-20.1
        l5-2.9c1.9,2,4.5,3.2,7.3,3.3c2.3,6.1,3.6,12.7,3.6,19.6C163.7,82.9,162.4,89.5,160.1,95.6z"/>
      <path className="foot" d="M105.8,84.7c1.2-4.4,3.3-4.4,4.5,0l22.5,79.6c1.2,4.4-1,9.2-4.9,9.2H90.4c-4,0-8.3-4.8-7-9.2
        C83.4,164.2,105.8,84.7,105.8,84.7z"/>
      <path className="cloud2" d="M203.7,86.7c-1.3-6-6.6-10.4-12.9-10.4c-1.8,0-3.6,0.4-5.2,1c-2.3-3.7-6.5-6.2-11.2-6.2
        c-7.3,0-13.2,5.9-13.2,13.2c0,0.8,0.1,1.7,0.2,2.5c-5.9,1.3-10.4,6.6-10.4,12.9c0,7.3,5.9,13.2,13.2,13.2h37.4
        c7.3,0,13.2-5.9,13.2-13.2C214.9,93.1,210,87.6,203.7,86.7z"/>

    </svg>
  );

};

export default FerrisWheelPreloader;

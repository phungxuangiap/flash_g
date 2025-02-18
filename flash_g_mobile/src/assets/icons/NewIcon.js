import * as React from 'react';
import Svg, {Defs, LinearGradient, Stop, Path} from 'react-native-svg';
export const NewIcon = function (props) {
  console.log(props);
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        imageRendering: 'optimizeQuality',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
      viewBox="0 0 6.72 6.72"
      height={props.height}
      width={props.width}
      {...props}>
      <Defs>
        <LinearGradient
          id="a"
          x1={0.757}
          x2={5.963}
          y1={3.362}
          y2={3.362}
          gradientUnits="userSpaceOnUse">
          <Stop
            offset={0}
            style={{
              stopColor: props.color,
            }}
          />
          <Stop
            offset={1}
            style={{
              stopColor: props.color,
            }}
          />
        </LinearGradient>
        <LinearGradient
          xlinkHref="#a"
          id="b"
          x1={1.882}
          x2={4.942}
          y1={3.36}
          y2={3.36}
          gradientUnits="userSpaceOnUse"
        />
      </Defs>
      <Path
        d="M1.882 3.848v-.976h.132l.513.766v-.766h.123v.976h-.132l-.512-.767v.767h-.124zm.988 0v-.976h.705v.115H3v.3h.54V3.4h-.54v.332h.599v.115H2.87zm1.077 0-.26-.976h.133l.149.64c.015.067.03.133.04.2a9.39 9.39 0 0 1 .045-.181l.185-.659h.156l.14.494c.035.122.06.238.076.345a4.53 4.53 0 0 1 .048-.212l.153-.627h.13l-.268.976H4.55l-.206-.743a3.664 3.664 0 0 1-.03-.115 2.46 2.46 0 0 1-.029.115l-.207.743h-.131z"
        style={{
          fill: 'url(#b)',
          fillRule: 'nonzero',
        }}
      />
      <Path
        d="m3.38 1.236.537-.4.076-.056.043.084.312.62.662-.104.093-.015-.001.095-.011.694.633.215.09.03-.045.083-.332.61.46.485.066.068-.079.053-.577.385.183.644.026.091-.095.01-.69.073-.137.655-.019.092-.088-.035-.645-.256-.426.516-.06.074-.062-.072-.452-.527-.617.26-.087.036-.021-.093-.156-.676-.666-.057L1.2 4.81l.024-.092.177-.67-.564-.361-.08-.051.064-.07.469-.512-.332-.582L.91 2.39 1 2.358l.652-.236-.024-.669-.003-.094.093.012.688.095.29-.603.041-.086.077.055.565.404zm.556-.215-.508.377-.046.035-.047-.034-.535-.382-.274.57-.026.053-.057-.008-.651-.09.022.633.002.058-.055.02-.618.223.314.55.029.05-.04.042-.443.485.533.341.049.032-.015.056-.167.635.63.054.058.005.013.057.147.64.583-.245.054-.022.038.044.427.499.403-.488.037-.045.054.021.61.243.13-.619.012-.057.058-.006.654-.069-.173-.609-.016-.055.048-.032.547-.365-.436-.458-.04-.043.028-.05.314-.578-.599-.203-.055-.019.001-.058.01-.657-.624.098-.058.01-.026-.052-.296-.587z"
        style={{
          fill: 'url(#a)',
          fillRule: 'nonzero',
        }}
      />
      <Path
        d="M0 0h6.72v6.72H0z"
        style={{
          fill: 'none',
        }}
      />
    </Svg>
  );
};

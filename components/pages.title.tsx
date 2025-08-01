import React, { memo } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fontSize } from 'styles/theme';
import Element1 from 'public/images/icon/element_1.svg';
import Element4 from 'public/images/icon/element_4.svg';
import { BreakpointsContext } from 'contexts/breakpoints';

interface Props {
  text: string;
};

const fontSizeTypo = 24;
const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: theme.palette.primary.main,
  margin: theme.spacing(12, 0, 0),
  padding: theme.spacing(5),
  borderRadius: theme.spacing(2),
  minHeight: theme.spacing(38),
  '& .MuiTypography-root': {
    fontSize: fontSize + fontSizeTypo,
    textTransform: 'uppercase',
    fontWeight: 700,
    color: theme.palette.common.white,
    '&:before': {
      content: `attr(data-text)`,
      position: 'absolute',
      fontSize: fontSize + (fontSizeTypo * 2),
      textAlign: 'center',
      lineHeight: 1.4,
      top: '50%',
      left: '50%',
      width: '70%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.1,
      fontWeight: 800,
    },
  },
  '& .wrapper-svg1, & .wrapper-svg2': {
    position: 'absolute',
    zIndex: 0,
    '& svg': {
      height: '100%',
    },
  },
  '& .wrapper-svg1': {
    height: theme.spacing(20),
    width: theme.spacing(20),
    bottom: 0,
    right: 0,
    transform: 'translate(30%, 30%)',
    '& svg circle': {
      stroke: `${theme.palette.secondary.main} !important`,
    },
  },
  '& .wrapper-svg2': {
    top: 0,
    left: 0,
    height: theme.spacing(12),
    width: theme.spacing(12),
    transform: 'translate(30%, -25%)',
    '& svg path': {
      stroke: theme.palette.secondary.main,
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    minHeight: 'auto',
    margin: theme.spacing(5, 0, 0),
    '& .MuiTypography-root': {
      fontSize: fontSize + 4,
      '&:before': {
        display: 'none',
      },
    },  
    '& .wrapper-svg1, & .wrapper-svg2': {
      display: 'none',
    },
  },
}));

const PagesTitle: React.FunctionComponent<Props> = ({
  text,
}: Props) => {  
  const { downSm } = React.useContext(BreakpointsContext);
  return (
    <BoxStyled>
      {!downSm &&
        <>
          <Box className="wrapper-svg1">
            <Element1 />
          </Box>
          <Box className="wrapper-svg2">
            <Element4 />
          </Box>
        </>
      }
      <Typography data-text={text}>
        {text}
      </Typography>
    </BoxStyled>
  );
};

PagesTitle.defaultProps = {};

export default memo(PagesTitle);
import React, { memo } from 'react';
import {
  Box,
  Skeleton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles';
import CarouselContent from 'components/carousel.content';
import Title from 'components/title';
import { BreakpointsContext } from 'contexts/breakpoints';
import schema from 'types/schemas'

interface Props { };

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  backgroundColor: theme.palette.mode == 'dark' ? theme.palette.grey.A100 : theme.palette.primary.main,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(8, 3),
  margin: theme.spacing(5, 3),
  '& .MuiGrid-container': {
    position: 'relative',
    zIndex: 1,
  },
  '& .slick-arrow': {
    top: '50%',
    '&.prev': {
      left: theme.spacing(-3),
    },
    '&.next': {
      right: theme.spacing(-3),
    },
  },
  '& a': {
    color: `${theme.palette.common.white} !important`,
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(5, 0),
    '& .slick-arrow': {
      '&.prev': {
        left: theme.spacing(0),
      },
      '&.next': {
        right: theme.spacing(0),
      },
    },
  },
}));

const HomeSection4: React.FunctionComponent<Props> = () => {
  const { downSm } = React.useContext(BreakpointsContext);
  const loading = false;
  const { data } = useQuery<{ data: schema['schemas']['Article'][] }>(['home_info'])
  return (
    <BoxStyled>
      <Box
        display="flex"
        position="absolute"
        top={0}
        left="50%"
        sx={{
          transform: 'translate(-50%, -50%)',
          '& .MuiTypography-root': {
            whiteSpace: 'nowrap',
          },
        }}
      >
        <Title
          text="Agenda Kota"
          paddingY={2}
          paddingX={2}
          withBackground={true}
          justifyContent="center"
        />
      </Box>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={150}
          sx={{
            borderRadius: 3,
            bgcolor: 'rgba(0, 0, 0, 0.1)',
          }}
        />
      ) : (
        <>
          {!!data?.data?.length &&
            <CarouselContent
              data={data.data}
              gridContent={6}
              gridImage={6}
              slidesToShow={downSm ? 1 : 2}
              gridSpacing={2}
              route="agenda"
              withDescription={false}
              truncateTitle={60}
            />
          }
        </>
      )}
    </BoxStyled>
  );
};

HomeSection4.defaultProps = {};

export default memo(HomeSection4);
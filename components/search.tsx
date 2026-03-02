import React, { memo } from 'react'
import { InputBase, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { fontSize } from 'styles/theme'
import SearchIcon from 'public/images/icon/search_2.svg'
import { AccessibilityContext } from 'contexts/accessibility'

interface Props {
  isFooter?: boolean
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.spacing(5),
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  marginRight: theme.spacing(1),
  '& svg': {
    height: fontSize + 2,
    '& path': {
      fill: `${theme.palette.common.white} !important`,
    },
  },
  '&.negative svg path': {
    fill: `${theme.palette.common.white} !important`,
  },
}))

const StyledInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  color: theme.palette.common.white,
  fontWeight: 200,
  position: 'relative',
  zIndex: 1,
  '& input': {
    padding: 0,
    color: theme.palette.common.white,
    fontWeight: 200,
    '&::placeholder': {
      color: theme.palette.common.white,
      opacity: 1,
    },
  },
}))

const Search: React.FunctionComponent<Props> = ({ isFooter }: Props) => {
  const router = useRouter()
  const accessibility = React.useContext(AccessibilityContext)
  const [text, setText] = React.useState('')

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const value = (e.target as HTMLInputElement).value
        router.push(
          `/id/berita?page=1${value ? `&q=${value}` : ''}`,
          `/id/berita?page=1${value ? `&q=${value}` : ''}`
        )
      }
    },
    [router]
  )

  return (
    <StyledBox
      sx={{
        paddingTop: isFooter ? 1.2 : 1.7,
        paddingBottom: isFooter ? 1.5 : 2,
        paddingLeft: isFooter ? 3 : 4,
        paddingRight: isFooter ? 3 : 5,
        justifyContent: isFooter ? 'flex-start' : 'center',
        maxWidth: isFooter ? 280 : 440,
        zIndex: 9999,
      }}
    >
      <IconWrapper className={accessibility.css.negative ? 'negative' : ''}>
        <SearchIcon />
      </IconWrapper>
      <StyledInput
        value={text}
        autoComplete="off"
        placeholder="Apa yang sedang anda cari?"
        inputProps={{
          sx: {
            fontSize: fontSize + accessibility.fontSize + (isFooter ? 0 : 1),
          },
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </StyledBox>
  )
}

Search.defaultProps = {
  isFooter: false,
}

export default memo(Search)

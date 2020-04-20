import styled from 'styled-components'

export const Card = styled.div`
  background-color: ${props => props.color || 'white'};
  display: flex;
  justify-content: space-between;
  border: solid 1px gray;
  border-radius: 3px;
  padding: 3px;
  align-items: baseline;
`

export const Time = styled.div`
  font-size: small;
  color: white;
  text-align: right;
  width: 30px;
`

export const Message = styled.div`

`

export const Icon = styled.div`
  width: 100px;
  text-align: center;
`
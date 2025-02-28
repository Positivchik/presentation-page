import { FC } from "react"
import { Flexbox } from "@components/Flexbox"
import styled from '@emotion/styled'
import { Link } from "react-router-dom"

const StyledMenuItem = styled.div`
    cursor: pointer;
    color: green;
`
export const Menu: FC<any> = () => {
    return (<Flexbox tag="nav" gap={10}>
        <StyledMenuItem><Link to="/">Main</Link></StyledMenuItem>
        <StyledMenuItem><Link to="/location">Location</Link></StyledMenuItem>
    </Flexbox>)
}
import { User } from "@/modules/user/domain"
import { UserAuthenticateResponse } from "@/modules/user/protocols"

export interface ResponseAdapter {
    id: string,
    attributes: any,
    links: {
        self: string
    },
    token?: {
        access_token: string,
        refresh_token: string
    }
}

export const userResponse = (user: User): ResponseAdapter => {
    return {
        id: user.id,
        attributes: {
            name: user.props.name,
            email: user.props.email,
            active: user.props.active,
        },
        links: {
            self: "/api/user/"+user.id
        }
    }
}

export const userTokenResponse = (user: UserAuthenticateResponse): ResponseAdapter => {
    return {
        id: user.id,
        attributes: {
            name: user.props.name,
            email: user.props.email,
            active: user.props.active,
        },
        links: {
            self: "/api/user/"+user.id
        },
        token: {
            access_token: user.token.accessToken,
            refresh_token: user.token.refreshToken
        }
    }
}
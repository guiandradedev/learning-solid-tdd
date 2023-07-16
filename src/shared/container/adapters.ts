import { HashAdapter, BcryptHashAdapter } from "../adapters/hash";
import { JwtSecurityAdapter, SecurityAdapter } from "../adapters/security";
import { container } from "tsyringe";


container.registerSingleton<HashAdapter>(
    "HashAdapter",
    BcryptHashAdapter
)

container.registerSingleton<SecurityAdapter>(
    "SecurityAdapter",
    JwtSecurityAdapter
)
import { RoleEnum } from "./backend/src/enums/role.enum";

db.createUser(
    {
        user: "user",
        pwd: "user",
        roles: [
            {
                role: "readWrite",
                db: "node-server",
            },
        ],
    },
);

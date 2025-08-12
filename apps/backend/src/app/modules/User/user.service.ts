import * as bcrypt from 'bcrypt';
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: any[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

const getMyProfile = async (user: IAuthUser) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            isDeleted: false
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return userInfo;
};

const changePassword = async (user: IAuthUser, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            isDeleted: false
        }
    });

    const isCorrectPassword = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            id: userData.id
        },
        data: {
            password: hashedPassword
        }
    });
};

export const userService = {
    getAllFromDB,
    getMyProfile,
    changePassword
};

import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { TOKEN_SECRET_KEY } from '../../configs/index.config';
import { decrypt, getDerivedKey } from '../../utils/crypto.util';
import { User, UserDocument, UserJoiSchema } from '../../models/user.model';
import { AdminLogService } from '../adminlog/adminlog.service';
import userDefaultData from '@blog/server/configs/user.default.config';
import { InjectModel } from '@nestjs/mongoose';
import { ConsoleSqlOutlined } from '@ant-design/icons';

@Injectable()
export class LoginService {
    constructor(
        private readonly adminLogService: AdminLogService,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    async getFirstLoginInfo() {
        /**
         * 判断是否是首次登陆。首次则提示信息
         */
        const count = await this.userModel.countDocuments({});
        if (count <= 0) {
            return {
                message:
                    'Bạn là người đăng nhập đầu tiên và tài khoản này sẽ là tài khoản quản trị viên của bạn, xin nhớ!Đăng nhập trực tiếp để tạo tài khoản!',
            };
        }
        return '';
    }

    async login(data) {
        const U = JSON.parse(decrypt(data.key));
        const userName = U.userName;
        const account = U.account;
        const password = U.password;
        const count = await this.userModel.countDocuments({});
        const result = Joi.object(UserJoiSchema).validate(U);
        console.log(U);
        if (count <= 0) {
            /**
             * 首次登陆，即为管理员账号，仅一次。
             */
            if (result.error) {
                throw new BadRequestException(
                    'Bạn là người đăng nhập đầu tiên, tài khoản này sẽ là tài khoản quản trị viên của bạn, vui lòng nhớ!' + result.error.message
                );
            }
            const user = await this.userModel.create({
                userName,
                account,
                avatar: userDefaultData.avatar,
                password: getDerivedKey(password),
            });
            return {
                userName: user.userName,
                avatar: user.avatar,
                email: user.email,
                account,
                token: jwt.sign({ account, roles: ['admin'] }, TOKEN_SECRET_KEY, {
                    expiresIn: 60 * 60,
                }),
            };
        }
        const user = await this.userModel.findOne({
            account,
            // password: password,
            password: getDerivedKey(password),
        });
        if (user) {
            this.adminLogService.create({
                data: `Tài khoản : ${user.account} Đăng nhập hệ thống`,
                type: 'Đăng nhập hệ thống',
                user: user._id,
            });
            return {
                userName: user.userName,
                avatar: user.avatar,
                email: user.email,
                account,
                token: jwt.sign({ account, roles: ['admin'] }, TOKEN_SECRET_KEY, {
                    expiresIn: 60 * 60,
                }),
            };
        }
        throw new BadRequestException(
            'Tên người dùng hoặc đầu vào mật khẩu đã sai, vui lòng kiểm tra lại trước khi đăng nhập'
        );
    }
}

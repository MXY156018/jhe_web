<template>
  <div id="userLayout">
    <div class="login_panle">
      <div class="login_panle_form">
        <div class="login_panle_form_title">
          <img
            class="login_panle_form_title_logo"
            src="../../assets/logo_login1.jpg"
            alt
          />
          <p class="login_panle_form_title_p">JHE 後台管理</p>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          @keyup.enter="submitForm"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名">
              <template #suffix>
                <i class="el-input__icon el-icon-user" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :type="lock === 'lock' ? 'password' : 'text'"
              placeholder="请输入密码"
            >
              <template #suffix>
                <i
                  :class="'el-input__icon el-icon-' + lock"
                  @click="changeLock"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item style="position: relative" prop="captcha">
            <el-input
              v-model="loginForm.captcha"
              name="logVerify"
              placeholder="请输入验证码"
              style="width: 60%"
            />
            <div class="vPic">
              <img
                v-if="picPath"
                :src="picPath"
                alt="请输入验证码"
                @click="loginVerify()"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" style="width: 46%" @click="checkInit"
              >前往初始化</el-button
            > -->
            <el-button
              type="primary"
              style="width: 46%"
              @click="submitForm"
              >登 录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="login_panle_right" />
      <div class="login_panle_foot">
        <!-- <div class="links">
          <a href="http://doc.henrongyi.top/">
            <img src="@/assets/docs.png" class="link-icon" />
          </a>
          <a href="https://www.yuque.com/flipped-aurora/">
            <img src="@/assets/yuque.png" class="link-icon" />
          </a>
          <a href="https://github.com/flipped-aurora/gin-vue-admin">
            <img src="@/assets/github.png" class="link-icon" />
          </a>
          <a href="https://space.bilibili.com/322210472">
            <img src="@/assets/video.png" class="link-icon" />
          </a>
        </div>
        <div class="copyright">
          Copyright &copy; {{ curYear }} 💖 flipped-aurora
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { captcha } from '@/api/user'
import { checkDB } from '@/api/initdb'
export default {
  name: 'Login',
  data() {
    const checkUsername = (rule, value, callback) => {
      if (value.length < 5) {
        return callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (value.length < 6) {
        return callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    return {
      curYear: 0,
      lock: 'lock',
      loginForm: {
        username: 'admin',
        password: '123456',
        captcha: '',
        captchaId: ''
      },
      rules: {
        username: [{ validator: checkUsername, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' },
          {
            min: 5,
            max: 6,
            message: '验证码格式不正确',
            trigger: 'blur',
          }]
      },
      logVerify: '',
      picPath: ''
    }
  },
  created() {
    this.loginVerify()
    this.curYear = new Date().getFullYear()
  },
  methods: {
    ...mapActions('user', ['LoginIn']),
    async checkInit() {
      const res = await checkDB()
      if (res.code === 0) {
        if (res.data?.needInit) {
          this.$store.commit('user/NeedInit')
          this.$router.push({ name: 'Init' })
        } else {
          this.$message({
            type: 'info',
            message: '已配置数据库信息，无法初始化'
          })
        }
      }
    },
    async login() {
      return await this.LoginIn(this.loginForm)
    },
    async submitForm() {
      this.$refs.loginForm.validate(async(v) => {
        if (v) {
          const flag = await this.login()
          if (!flag) {
            this.loginVerify()
          }
        } else {
          this.$message({
            type: 'error',
            message: '请正确填写登录信息',
            showClose: true
          })
          this.loginVerify()
          return false
        }
      })
    },
    changeLock() {
      this.lock = this.lock === 'lock' ? 'unlock' : 'lock'
    },
    loginVerify() {
      captcha({}).then((ele) => {
        this.picPath = ele.data.picPath
        this.loginForm.captchaId = ele.data.captchaId
      })
    }
  }
}

</script>




<style lang="scss" scoped>
#userLayout {
    margin: 0;
    padding: 0;
    background-size: cover;
    width: 100%;
    height: 100%;
    position: relative;
    .login_panle {
        position: absolute;
        top: 3vh;
        left: 2vw;
        width: 96vw;
        height: 94vh;
        background-color: rgba(255, 255, 255, .8);
        backdrop-filter: blur(5px);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .login_panle_right {
            // background-image: url("@/assets/background.jpg");
            // background-size: cover;
            width: 40%;
            height: 60%;
            float: right !important;
			transform: rotateY(180deg);
        }
        .login_panle_form {
            width: 420px;
            background-color: #fff;
            padding: 40px 40px 40px 40px;
            border-radius: 10px;
            box-shadow: 2px 3px 7px rgba(0, 0, 0, .2);
            .login_panle_form_title {
                display: flex;
                align-items: center;
                margin: 30px 0;
                .login_panle_form_title_logo {
                    width: 90px;
                    height: 90px;
                }
                .login_panle_form_title_p {
                    font-size: 40px;
                    padding-left: 20px;
                }
            }
            .vPic {
                width: 33%;
                height: 38px;
                float: right !important;
                background: #ccc;
                img {
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    vertical-align: middle;
                }
            }
        }
        .login_panle_foot {
            position: absolute;
            bottom: 20px;
            .links {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .link-icon {
                    width: 30px;
                    height: 30px;
                }
            }
            .copyright {
                color: #777777;
                margin-top: 5px;
            }
        }
    }
}

//小屏幕不显示右侧，将登陆框居中
@media (max-width: 750px) {
    .login_panle_right {
        display: none;
    }
    .login_panle {
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
    }
    .login_panle_form {
        width: 100%;
    }
}


/*
  powerBy : bypanghu@163.com
*/
</style>

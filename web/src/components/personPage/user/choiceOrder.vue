<template>
	<div class="choice-order">
		<person-title>当前位置 :: 我的订单 >> <em>创建订单</em></person-title>
		<div class="choice-order-cont">
			<div class="choice-order">
				<p class="title">小鹅帮您拿！请选择您需要的订单类型：
				</p>
			</div>
			<div class="info-cont">
				<el-radio v-model="choiceOrderForm" label="1" border>校园代取</el-radio>
				<el-radio v-model="choiceOrderForm" label="2" border>校园代拿</el-radio>
			</div>
			<el-button style="margin-top:3rem" type="primary" @click="submitForm('choiceOrder')">确定</el-button>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				choiceOrderForm: ''
			}
		},
		methods: {
			submitForm() {
				switch (this.choiceOrderForm) {
					case '1':{
							this.$router.push({
								path: 'newOrder'
							});
							break;
					}
					case '2':{
						this.$router.push({
							path: 'newPicOrder'
						});
						break;
					}
						
				}
			}
		}
	}
</script>

<style lang='scss'>
	.choice-order-cont {
		padding-top: 4rem;

		.info-cont {
			padding-top: 2rem;
			width: 40%;
			min-width: 20rem;
			margin: 0 auto;
		}
	}

	.choice-order .title {
		color: #777;
		margin-bottom: 2rem;
	}
</style>

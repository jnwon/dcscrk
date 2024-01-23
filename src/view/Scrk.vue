<template>
  <div class="container">
    <img v-if="fetching" style="scale:0.7" src="@/assets/mandu_kyaa.png">
    <img v-else style="scale:0.7" src="@/assets/mandu.png" id="allBtn" v-popover:top="'ALL 버튼을 클릭하면 전체 게시물이 다시 나타나요!'">
    <h4> {{ (startDt? startDt.split('T')[0] + ' ~ ' : '') + (endDt? endDt.split('T')[0] : (startDt? '오늘' : '')) + (users.length > 0? (' | ' + users.length + '명, ' + articles.length + '건') : '') }}</h4>
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <div class="list-group" :style="'overflow: auto; max-height: ' + (isMobile? '200px' : '300px')" id="userList" v-popover:top="'유저이름을 클릭하면 해당 유저의 게시물만 보여줘요.'">
            <a v-for="(user, index) in users" :key="index" href="javascript:void(0)" @click="renderArticles(user.name)" class="list-group-item" style="display: flex; justify-content: space-between;">
                <div class="postTitle" style="text-align: left;">
                    <span :style="selectedUser == user.name? 'color:coral' : ''"> {{ user.name }} </span>
                </div>
                <div class="postMeta">
                    <span style="font-size:small; color:grey"> {{user.num}} 건</span>
                </div>
            </a>
        </div>
        <div v-if="!isMobile" class="list-group" style="max-height: 300px; overflow: auto;">
            <a v-for="(article, index) in articlesRendered" :key="index" :href="'https://gall.dcinside.com/' + (isMinorGallery? 'mgallery/' : '') + 'board/view/?id=' + gallId + '&no=' + article.gallNum" target="_blank" class="list-group-item" style="display: flex; justify-content: space-between;">
                <div class="postTitle" style="text-align: left;">
                    <span v-if="article.nodata">{{ article.nodata }}</span>
                    <span v-else> {{ (isMinorGallery? '[' + article.gallSubject + ']' : '') + article.gallTit + (article.gallReplyNum != '0'? ' [' + article.gallReplyNum + ']' : '') }} </span>
                </div>
                <div class="postMeta">
                    <span v-if="!article.nodata" style="font-size:small; color:grey"> {{ article.gallWriter }} | {{ article.gallDate.split(' ')[0] }} | <i class="fas fa-eye"></i> {{ article.gallCount }} | <i class="fas fa-thumbs-up"></i> {{ article.gallRecommend }}</span>
                </div>
            </a>
        </div>
        <div v-else class="list-group" style="max-height: 300px; overflow: auto;">
            <a v-for="(article, index) in articlesRendered" :key="index" :href="'https://gall.dcinside.com/' + (isMinorGallery? 'mgallery/' : '') + 'board/view/?id=' + gallId + '&no=' + article.gallNum" target="_blank" class="list-group-item">
                <div class="postTitle" style="text-align: left;">
                    <span v-if="article.nodata">{{ article.nodata }}</span>
                    <span v-else> {{ (isMinorGallery? '[' + article.gallSubject + '] ' : '') + article.gallTit + (article.gallReplyNum != '0'? ' [' + article.gallReplyNum + ']' : '') }} </span>
                </div>
                <div class="postMeta" style="text-align: left;">
                    <span v-if="!article.nodata" style="font-size:small; color:lightgrey"> {{ article.gallWriter }} | {{ article.gallDate.split(' ')[0] }} | <i class="fas fa-eye"></i> {{ article.gallCount }} | <i class="fas fa-thumbs-up"></i> {{ article.gallRecommend }}</span>
                </div>
            </a>
        </div>

        <div style="display: flex; justify-content: space-between; text-align: justify; padding: 10px">
          <span style="margin-right: 20px; cursor: pointer;" onclick="window.$('#setting').modal('show')"><i class="fas fa-cog"/></span>
          <span v-if="selectedUser" style="cursor: pointer; position:absolute; left: 15%;" @click="renderArticles(null)"><b>ALL</b></span>
          <div v-if="fetching" class="progress" style="width: 70%">
            <div class="progress-bar progress-bar-striped active" role="progressbar" :aria-valuenow="fetchedProps" aria-valuemin="0" aria-valuemax="100" :style="'width:' + fetchedProps + '%'">
              {{ fetchedProps }}%
            </div>
          </div>
          <span v-if="users.length > 0" style="cursor: pointer; position:absolute; right: 15%;" onclick="window.$('#exportOption').modal('show')"><i class="fas fa-share-alt"></i></span>
          <span v-if="!fetching" style="cursor: pointer;" @click="fetchData()"><i class="fas fa-play"></i></span>
          <span v-else style="cursor: pointer;" onclick="location.reload()"><i class="fas fa-stop"></i></span>
        </div>
        <span>개발자연락처: <a href="mailto:atalanta1618@gmail.com?subject=[실창랭킹] ">atalanta1618@gmail.com</a></span>

      </div>
      <div class="col-sm-2"></div>
    </div>

    <div id="setting" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body" style="text-align: left;">
                    <div style="display:flex;">
                      <h4 style="margin-right:15px">갤 ID&nbsp;<i class="far fa-question-circle" style="cursor:pointer" v-tooltip="'gall.dcinside.com/board/lists?id=mlp 에서 mlp'"></i></h4>
                      <div class="checkbox">
                          <label>
                              <input type="checkbox" v-model="isMinorGallery">
                              마이너 갤러리
                          </label>
                      </div>
                    </div>
                    <div style="display:flex; margin-bottom: 20px;">
                        <input type="text" v-model="gallId" style="height:26px; margin-right:10px;" @keypress.enter="checkGallId()"/>
                        <button type="button" class="btn btn-sm btn-default" style="height:26px;" @click="checkGallId()"> 확인 <i v-if="checking" class="fa fa-spinner fa-spin"/></button>    
                    </div>
                    <h4>검색범위 시작일자</h4>
                    <Datepicker :endDate="endDt" @update-date="setStrtDt" style="height:26px;"/>
                    <h4>검색범위 종료일자</h4>
                    <Datepicker :startDate="startDt" @update-date="setEndDt" style="height:26px;"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-info" data-dismiss="modal"> 완료 </button>
                </div>
            </div>  
        </div>
    </div>

    <div id="exportOption" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title" style="text-align: left"> 내보내기에 포함할 데이터를 선택하세요. </h4>
                </div>
                <div class="modal-body" style="text-align: left;">
                  <div class="checkbox">
                      <label>
                          <input type="checkbox" v-model="exportUsers">
                          유저 집계 데이터
                      </label>
                  </div>
                  <div class="checkbox">
                      <label>
                          <input type="checkbox" v-model="exportArticles">
                          게시물 집계 데이터
                      </label>
                  </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-info" data-dismiss="modal" id="export" onclick="alert('클립보드에 HTML소스가 복사되었습니다.\n디시인사이드 글쓰기 페이지의 HTML편집기에 붙여넣기 해주세요.')"> 내보내기 </button>
                </div>
            </div>  
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Clipboard from 'clipboard'
import Datepicker from '@/components/Datepicker.vue'

export default {
  name: 'DcScrk',
  components: {
    Datepicker
	},
  data () {
    return {
      fetching: false,
      checking: false,
      isChecked: false,
      isMobile: false,
      isMinorGallery: false,
      gallId: '',
      startDt: '',
      endDt: '',
      users: [],
      usersMap: {},
      articles: [],
      articlesRendered: [],
      selectedUser: '',
      export:'',
      daterange: 0,
      fetchedDates: 0,
      fetchedProps: 0,
      exportUsers: true,
      exportArticles: true,
      tutorial: 0
    }
  },
  async mounted() {
    this.isMobile = window.innerWidth < 450;
    window.$('#setting').modal('show')
  },
  watch: {
    gallId() {
      this.isChecked = false;
    }
  },
  methods: {
    setStrtDt(date) {
        this.startDt = new Date(date).toISOString();
    },
    setEndDt(date) {
        this.endDt = new Date(date).toISOString();
        this.endDt = this.endDt.split('T')[0] + 'T23:59:59';
    },
    async checkGallId() {
      if(!this.gallId) {
        alert('갤 ID를 입력하세요.')
        return;
      }

      var request = {
        gallId: this.gallId,
        isMinorGallery: this.isMinorGallery,
        page: 1
      }
      this.checking = true;
      await axios.post('https://218.148.35.10/api/crawl/gall/sbest', request, {validateStatus: (status) => {return status < 500}}).then((res) => {
          if(res.status == 200){
            alert('갤 ID가 확인되었습니다.')
            this.isChecked = true;
          }
          else{
            alert(res.status, res.data);
          }
      }).catch(() => {
        alert('존재하지않는 갤 ID입니다.')
      });
      this.checking = false;
    },
    async fetchData() {
      if(!this.isChecked) {
        alert('갤 ID 확인을 완료해주세요.')
        return;
      }

      if(!this.startDt) {
        alert('검색범위 시작일자를 선택하세요.');
        return;
      }

      this.articles = [];
      this.articlesRendered = [];
      this.users = [];
      this.usersMap = {};
      this.selectedUser = '';
      this.export = '';
      this.fetchedDates = 0;
      this.fetchedProps = 0;
      const now = new Date();
      this.daterange = (now.getTime() - new Date(this.startDt).getTime()) / (3600*24*1000)

      var i = 1
      this.fetching = true;
      while(this.fetching) {
        var request = {
          gallId: this.gallId,
          isMinorGallery: this.isMinorGallery,
          startDt: this.startDt,
          endDt: this.endDt,
          page: i++
        }
        await axios.post('https://218.148.35.10/api/crawl/gall/sbest', request, {validateStatus: (status) => {return status < 500}}).then((res) => {
            if(res.status == 200){
              var lastDate = null;
              res.data.articleList.forEach((article) => {
                lastDate = new Date(article.gallDate);
                if((this.endDt && new Date(article.gallDate).getTime() < new Date(this.endDt).getTime() || !this.endDt) && article.gallArticleType.indexOf('best') >0 && new Date(article.gallDate).getTime() >= new Date(this.startDt).getTime()) {
                  this.articles.push(article);
                }
                else if(new Date(article.gallDate).getTime() < new Date(this.startDt).getTime()) {
                  this.fetching = false;
                  return;  
                }
              })
              this.fetchedDates = (now.getTime() - lastDate.getTime()) / (3600*24*1000)
              this.fetchedProps = parseInt(this.fetchedDates *100 / this.daterange)
              if(parseInt(res.data.articleNum) < 0) {
                this.fetching = false;
              }
            }
            else{
                alert(res.status, res.data);
            }
        }).catch(() => {
          this.fetching = false;
        });
      }
      if(this.articles.length == 0) {
        this.articlesRendered.push({nodata: '실베글이 없습니다.'})
      }
      else {
        this.articlesRendered = this.articles;
        this.articles.forEach((article) => {
          if(this.usersMap[article.gallWriter]) {
            this.usersMap[article.gallWriter]++;
          }
          else {
            this.usersMap[article.gallWriter] = 1;
          }
        })
        for(var writer in this.usersMap) {
          this.users.push({name: writer, num: this.usersMap[writer]});
        }
        this.users.sort((a,b) => b.num - a.num)
        if(this.tutorial == 0) {
          window.$("#userList").tooltip('show');
          setTimeout(() => {
            window.$("#userList").tooltip('hide');
            window.$("#userList").tooltip('destroy');
          }, 2000)
          
          this.tutorial = 1;
        }

        var leftTable = '<table cellspacing="0" cellpadding="0" border="0" style="border:none;border-collapse:collapse;"><tbody>';
        this.users.forEach((user) => {
          leftTable += '<tr style="border:1px solid #ccc">'
                          + '<td style="border:none">' + user.name + '</td>'
                          + '<td style="border:none; font-size:smaller; color:grey; width:30px">' + user.num + '건</td>'
                      + '</tr>'
        })
        leftTable += '</tbody></table>';

        var rightTable = '<table cellspacing="0" cellpadding="0" border="0" style="border:none;border-collapse:collapse;"><tbody>';
        this.articles.forEach((article) => {
          rightTable += '<tr style="border-top:1px solid #ccc; border-right:1px solid #ccc; border-left:1px solid #ccc">'
                          + '<td style="border:none">'
                            + '<a href="https://gall.dcinside.com/' + (this.isMinorGallery? 'mgallery/' : '') + 'board/view/?id=' + this.gallId + '&no=' + article.gallNum + '" target="_blank">'
                               + (this.isMinorGallery? '[' + article.gallSubject + ']' : '') + article.gallTit + (article.gallReplyNum != '0'? '<span style="font-size:smaller">[' + article.gallReplyNum + ']</span>' : '')
                            + '</a>'
                          + '</td>'
                      + '</tr>'
                      + '<tr style="border-bottom:1px solid #ccc; border-right:1px solid #ccc; border-left:1px solid #ccc">'
                          + '<td style="border:none; font-size:smaller; color:grey">'
                            + article.gallWriter + ' | ' + article.gallDate.split(' ')[0] + ' | ' + article.gallCount + ' view | ' + article.gallRecommend + ' chu'
                          + '</td>'
                      + '</tr>'
        })
        rightTable += '</tbody></table>';

        new Clipboard('#export', {
            text: () => {
                this.export = '<br><h4>실창랭킹 집계결과 | ' + this.startDt.split('T')[0] + ' ~ ' + (this.endDt? this.endDt.split('T')[0] : '오늘') + ' | ' + this.users.length + '명, ' + this.articles.length + '건</h4>'
                      + '<br>'
                      + '<table>'
                        + '<tbody>'
                          + '<tr>'
                            + (this.exportUsers? ('<td style="border:none;vertical-align:top;width:40%;padding-right:10px">' + leftTable + '</td>') : '')
                            + (this.exportArticles? ('<td style="border:none;vertical-align:top">' + rightTable + '</td>') : '')
                          + '</tr>'
                        + '</tbody>'
                      + '</table>'
                      + '<br><br>'
                return this.export;
            }
        });
      }
    },
    renderArticles(user) {
      this.selectedUser = user;
      this.articlesRendered = []
      if(user) {
        this.articles.forEach((article) => {
          if(article.gallWriter == user) {
            this.articlesRendered.push(article)
          }
        })
        if(this.tutorial == 1) {
          window.$("#allBtn").tooltip('show');
          setTimeout(() => {
            window.$("#allBtn").tooltip('hide');
            window.$("#allBtn").tooltip('destroy');
          }, 3000)
          this.tutorial = 2;
        }
      }
      else {
        this.articlesRendered = this.articles
      }
    }
  }
}
</script>

<style>

.postTitle {
    max-width: 60%;
    display: block;/* 블록태그로 만들어준다 */
    text-overflow: ellipsis;/* 말줄임 css */
    white-space: nowrap;/*글자를 한줄로 모아준다*/
    overflow: hidden;
}
.postMeta {
    max-width: 40%;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
@media screen and (max-width: 450px) {
  .postTitle {
    max-width: 100%;
    display: block;/* 블록태그로 만들어준다 */
    text-overflow: ellipsis;/* 말줄임 css */
    white-space: nowrap;/*글자를 한줄로 모아준다*/
    overflow: hidden;
  }
  .postMeta {
    max-width: 100%;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>

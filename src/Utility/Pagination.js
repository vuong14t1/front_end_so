class Pagination {
  curPage = 0;

  handlePagination(totalData, numberPerPage) {
    this.totalData = totalData;
    this.numberPerPage = numberPerPage;
    this.totalPage = this.calcNumberPage(totalData, numberPerPage);
    this.curData = this.getDataByPage(this.curPage);
  };

  calcNumberPage() {
    return Math.ceil(this.totalData.length / this.numberPerPage);
  };

  getDataByPage(page) {
    page = page === undefined ? 0 : page;
    if (page > this.totalPage) {
      page = this.totalPage;
    }

    page = page - 1; // page start from 0
    this.curPage = page;
    return this.totalData.slice(page * this.numberPerPage, (page + 1) * this.numberPerPage - 1);
  }
}

const instance = new Pagination();
export default instance;

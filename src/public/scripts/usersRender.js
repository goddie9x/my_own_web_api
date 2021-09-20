function reIndexColumns() {
    $('.index').each((index, element) => {
        element.innerHTML = index + 1;
    });
}

function increaseCountVal() {
    let ValCal = $('.countVal');

    ValCal.html(parseInt(ValCal[0].innerHTML, 10) + 1);
}

function decreaseCountVal() {
    let ValCal = $('.countVal');

    ValCal.html(parseInt(ValCal[0].innerHTML, 10) - 1);
}

function onDeleteBtnClick(e) {
    const confirmDeleteBtn = $('#alertDelete .delete');
    confirmDeleteBtn.unbind('click').on('click', function(event) {
        event.preventDefault();
        $.post(`user/${$(e.target).attr('btn-value')}?_method=delete`)
            .done(function() {
                $(e.target).closest('.user-item').remove();
                increaseCountVal();
                $(event.target).closest('.modal').find('.btn-close').click();
                reIndexColumns();
            });
    });
}

function onRestoreBtnClick(e) {
    $.get(`/user/restore/${$(e.target).attr('restoreId')}`, function(transport) {
        reIndexColumns();
        increaseCountVal();
        $(e.target).closest('.user-item').remove();
    });
}

function onForceDeleteBtnClick(e) {
    $('.force-delete').unbind('click').on('click', function(event) {
        $.post(`user/banned/${$(e.target).attr('btn-value')}?_method=delete`, function(transport) {
            reIndexColumns();
            $(e.target).closest('.user-item').remove();
            $(event.target).closest('.modal').find('.btn-close').click();
            decreaseCountVal();
        });
    });
}

function loadPage(page, staticUrl = '/', managerType) {
    const GENDER = ["Không rõ", "Nam", "Nữ"];

    if (page < 1) {
        page = 1;
    }
    $.get(`${staticUrl}?page=${page}`)
        .done(({ users }) => {
            let tableBody = $('.table tbody');

            tableBody.html('');
            if (users) {
                users.forEach((user, index) => {
                    let tempuser = `<tr class="user-item">`;
                    if (managerType) {
                        tempuser += `<td>
                            <input class="check-item" type="checkbox" name="id" value="${user._id}">
                        </td>`
                    }

                    tempuser += `<td class="index">${index + 1}</td>
                        <td class="hidden-mb">${user.account}</td>
                        <td>${user.name}</td>
                        <td>${user.dateOfBirth}</td>
                        <td>${user.gender}</td>
                        <td>Số bài đăng</td>
                        <td>Số tin đăng</td>`;
                    if (managerType) {
                        if (managerType == 'manager') {
                            tempuser += `
                            <td class="justify-content-evenly">
                              <a href="/users/modify/${user._id}" class="btn bg-primary">Sửa</a>
                              <div class="btn bg-danger delete" data-bs-toggle="modal" data-bs-target="#alertDelete"
                                btn-value="${user._id}" onclick="onDeleteBtnClick(event)">Ban</div>
                            </td>
                          </tr>`;
                        }
                        if (managerType == 'banned') {
                            tempuser += `
                            </td>
                            <td class="justify-content-evenly">
                                <div restoreId="${user._id}" class="btn bg-primary restore-btn" onclick="onRestoreBtnClick(event)">Gỡ ban</div>
                                <div class="btn bg-danger delete" data-bs-toggle="modal" data-bs-target="#alertDelete" btn-value="${user._id} onclick=" onForceDeleteBtnClick(event)">Xoá vĩnh viễn</div>
                            </td>
                          </tr>`;
                        }
                    } else {
                        tempuser += '</td></tr>';
                    }
                    tableBody.append(tempuser);
                });
            } else {
                tableBody.html(`
                        <tr>
                        <th colspan="${(managerType) ? (9) : (7)}" rowspan="3" class="text-center" scope="row">Hiện không có thời khoá biểu khả dụng</th>
                    </tr>
                `);
            }
            if (managerType) {
                managermentOption();
            }
        });
}

function renderPagination(urlMain = '/user/manager', managerType, typeTotalCount = 'notDelete', locator = 'user', mainPagination = '.pagination-down', pageSize = 8) {
    $(mainPagination).pagination({
        dataSource: '?page=1',
        locator: locator,
        pageSize: pageSize,
        showGoInput: true,
        showGoButton: true,
        formatGoInput: 'move to <%= input %>',
        totalNumberLocator: function(res) {
            return res[typeTotalCount];
        },
        afterPageOnClick: function(event, pageNumber) {
            loadPage(pageNumber, urlMain, managerType);
        },
        afterNextOnClick: function(event, pageNumber) {
            loadPage(pageNumber, urlMain, managerType);
        },
        afterPreviousOnClick: function(event, pageNumber) {
            loadPage(pageNumber, urlMain, managerType);
        },
        autoHidePrevious: true,
        autoHideNext: true,
    });
}

function managermentOption() {
    const checkAll = $('.checkall');
    const checkItem = $('.check-item');
    const realActionAll = $('.real-action-all-btn');

    checkAll.on('change', function() {
        if (this.checked) {
            checkItem.prop('checked', true);
        } else {
            checkItem.prop('checked', false);
        }
    });
    checkItem.each(function(index, element) {

        $(element).on('change', function() {
            let allCheckHasChecked = true;

            if (!this.checked) {
                checkAll.prop('checked', false);
            }

            checkItem.each(function(index2, element2) {
                if (!element2.checked) {
                    allCheckHasChecked = false;
                }
            });
            if (allCheckHasChecked) {
                checkAll.prop('checked', true);
            }
        });
    });

    $('.action-all-btn').on('click', function() {
        $('#action-all-modal .modal-body').html('<h2>Chiến</h2>');
    })

    realActionAll.on('click', function(e) {
        let countChecked = 0;
        checkItem.each(function(index, element) {
            if (element.checked) {
                countChecked++;
            }
        });
        if (countChecked && $('.action-select').val() != 'Hành động') {
            $('#action-all-modal .modal-body').html('<h2>Chiến</h2>');

            $('.form-container').submit();
        } else {
            $('#action-all-modal .modal-body').html('<h2>Chẳng có việc gì làm ở đây cả</h2>');
        }
    });
}
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
        $.post(`stored/${$(e.target).attr('btn-value')}?_method=delete`)
            .done(function() {
                $(e.target).closest('.schedule-item').remove();
                increaseCountVal();
                $(event.target).closest('.modal').find('.btn-close').click();
                reIndexColumns();
            });
    });
}

function onRestoreBtnClick(e) {
    $.get(`/schedules/restore/${$(e.target).attr('restoreId')}`, function(transport) {
        reIndexColumns();
        increaseCountVal();
        $(e.target).closest('.schedule-item').remove();
    });
}

function onForceDeleteBtnClick(e) {
    $('.force-delete').unbind('click').on('click', function(event) {
        $.post(`trash/${$(e.target).attr('btn-value')}?_method=delete`, function(transport) {
            reIndexColumns();
            $(e.target).closest('.schedule-item').remove();
            $(event.target).closest('.modal').find('.btn-close').click();
            decreaseCountVal();
        });
    });
}

function loadPage(page, staticUrl = '/', managerType) {
    const DOW = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
    const POD = ["Sáng", "Chiều", "Tối"];

    if (page < 1) {
        page = 1;
    }
    $.get(`${staticUrl}?page=${page}`)
        .done(({ schedules }) => {
            let tableBody = $('.table tbody');

            tableBody.html('');
            if (schedules) {
                schedules.forEach((schedule, index) => {
                    let tempSchedule = `<tr class="schedule-item">`;
                    if (managerType) {
                        tempSchedule += `<td>
                            <input class="check-item" type="checkbox" name="id" value="${schedule._id}">
                        </td>`
                    }

                    tempSchedule += `<td class="index">${index + 1}</td>
                        <td class="hidden-mb">${schedule.name}</td>
                        <td>${DOW[schedule.dayOfWeek]}</td>
                        <td>${POD[schedule.partOfDay]}</td>
                        <td>${schedule.room}</td>
                        <td>${schedule.dayStart} - ${schedule.dayEnd}</td>
                        <td>`;
                    schedule.linkMeet.forEach((link, index2) => {
                        tempSchedule += `<a href="${link}" target="_blank">Link ${index2 + 1}</a>`;
                    });
                    if (managerType) {
                        if (managerType == 'stored') {
                            tempSchedule += `
                            </td>
                            <td class="justify-content-evenly">
                              <a href="/schedules/modify/${schedule._id}" class="btn bg-primary">Sửa</a>
                              <div class="btn bg-danger delete" data-bs-toggle="modal" data-bs-target="#alertDelete"
                                btn-value="${schedule._id}" onclick="onDeleteBtnClick(event)">Xoá</div>
                            </td>
                          </tr>`;
                        }
                        if (managerType == 'trash') {
                            tempSchedule += `
                            </td>
                            <td class="justify-content-evenly">
                                <div restoreId="${schedule._id}" class="btn bg-primary restore-btn" onclick="onRestoreBtnClick(event)">Khôi phục</div>
                                <div class="btn bg-danger delete" data-bs-toggle="modal" data-bs-target="#alertDelete" btn-value="${schedule._id} onclick=" onForceDeleteBtnClick(event)">Xoá vĩnh viễn</div>
                            </td>
                          </tr>`;
                        }
                    } else {
                        tempSchedule += '</td></tr>';
                    }
                    tableBody.append(tempSchedule);
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

function renderPagination(urlMain = '/schedules', managerType, typeTotalCount = 'notDelete', locator = 'schedules', mainPagination = '.pagination-down', pageSize = 8) {
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
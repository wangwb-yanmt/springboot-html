//------------------------------------------树对应文本框的name要和树主体<ul>的id一样-------------------------------------------
$(function() {
	//树文本框绑定点击
	$(".treeFlag").on("click",function(e) {
		//先阻止冒泡，不然点击无反应
		e.stopPropagation();
		var name = $(this).attr("name");
		$("#"+name).toggle();
		//隐藏其他树
		$(".mytree").not("#"+name).css("display","none");
	})
	//文档绑定点击，隐藏树
	$(document).bind('click', function(e) {
		var e = e || window.event; //浏览器兼容性 
		var elem = e.target || e.srcElement;
		var flaelem = 0;
		while (elem) { //循环判断至跟节点，防止点击的是div子元素 
			if (elem.className && elem.className == 'ztree mytree') {
				flaelem = 1;
				return;
			}
			elem = elem.parentNode;
		}
		if (flaelem == 0) {
			$(".mytree").css("display","none");
		}
	});
});
//ztree渲染(复选框,上下级联)
function renderZtree(treeId,treeData) {
	var setting = {
			view: {
				nameIsHTML: true,
				showLine: false,
				showIcon: true,
			},
			check: {
				enable: true,
				chkStyle:"checkbox",
				chkboxType: {
					"Y": "ps",
					"N": "ps"
				}
			},
			callback: {
				onClick: function(event, treeId, treeNode) {
					var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
					zTreeObj.checkNode(treeNode, !treeNode.checked, true, true);//最后一个true表示触发onCheck
				},
				onCheck: function(event, treeId, treeNode) {
					var checkedValue = [];
					var checkedName = [];
					var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
					var checkedNodes = zTreeObj.getCheckedNodes(true);
					for (var i = 0, l = checkedNodes.length; i < l; i++) {
						checkedValue.push(checkedNodes[i].id);
						checkedName.push(checkedNodes[i].name);
					}
					$("[name='" + treeId + "']").val(checkedName.join(","));
					$("[name='" + treeId + "']").attr('dataID', checkedValue.join(","));
					//针对所属县区和所属分局联动
					if(treeId == "BELONG_ORG" && orgLevelName == "地级市局" && flag == "flag") {
						resetZtree("BELONG_DIST_ORG");
						$("[name=BELONG_DIST_ORG]").val("");
						if(checkedNodes.length == 0) {
							belongDistOrgTree();
						}else {
							belongDistOrgTree(checkedValue.join(","));
						}
					}
				}
			},
			data: {
				simpleData: {
					enable: true, //设置是否启用简单数据格式（zTree支持标准数据格式跟简单数据格式）
					idKey: "id", //设置启用简单数据格式时id对应的属性名称
					pidKey: "pId" //设置启用简单数据格式时parentId对应的属性名称,ztree根据id及pid层级关系构建树结构
				}
			}
	}
	$.fn.zTree.init($("#"+treeId), setting, treeData);
	//默认展开第一个节点
	var ztreeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes =  ztreeObj.getNodes();
	if (nodes.length>0) {
		ztreeObj.expandNode(nodes[0]);
	}
}

function renderZtreeRadio(treeId,treeData) {
	var setting = {
			view: {
				nameIsHTML: true,
				showLine: false,
				showIcon: true,
			},
			check: {
				enable: true,
				chkStyle: "radio"
			},
			callback: {
				onClick: function(event, treeId, treeNode) {
					var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
					zTreeObj.checkNode(treeNode, !treeNode.checked, true, true);//最后一个true表示触发onCheck
				},
				onCheck: function(event, treeId, treeNode) {
					var checkedValue = [];
					var checkedName = [];
					var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
					var checkedNodes = zTreeObj.getCheckedNodes(true);
					for (var i = 0, l = checkedNodes.length; i < l; i++) {
						checkedValue.push(checkedNodes[i].id);
						checkedName.push(checkedNodes[i].name);
					}
					$("[name='" + treeId + "']").val(checkedName.join(","));
					$("[name='" + treeId + "']").attr('dataID', checkedValue.join(","));
					//针对所属县区和所属分局联动
					if(treeId == "BELONG_ORG" && orgLevelName == "地级市局" && flag == "flag") {
						resetZtree("BELONG_DIST_ORG");
						$("[name=BELONG_DIST_ORG]").val("");
						if(checkedNodes.length == 0) {
							belongDistOrgTree();
						}else {
							belongDistOrgTree(checkedValue.join(","));
						}
					}
					$(".mytree").css("display","none");
				}
			},
			data: {
				simpleData: {
					enable: true, //设置是否启用简单数据格式（zTree支持标准数据格式跟简单数据格式）
					idKey: "id", //设置启用简单数据格式时id对应的属性名称
					pidKey: "pId" //设置启用简单数据格式时parentId对应的属性名称,ztree根据id及pid层级关系构建树结构
				}
			}
	}
	$.fn.zTree.init($("#"+treeId), setting, treeData);
	//默认展开第一个节点
	var ztreeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes =  ztreeObj.getNodes();
	if (nodes.length>0) {
		ztreeObj.expandNode(nodes[0]);
	}
}

//ztree单节点勾选
function checkZtreeNodes(treeId,value) {
	var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
	var node = zTreeObj.getNodeByParam("id",value);
	zTreeObj.checkNode(node, true, false, true);//3个true 表示是否勾选节点/是否根据设置的联动属性勾选/是否触发beforeCheck & onCheck 事件
	
}
//ztree重置,值清空
function resetZtree(treeId) {
	var zTreeobj = $.fn.zTree.getZTreeObj(treeId);
	zTreeobj.checkAllNodes(false);
	$("[name='"+treeId+"']").attr('dataID', '');
	$("[name='"+treeId+"']").val("");
}
//ztree灰化不可编辑
function disabledZtree(treeId) {
	var zTreeobj = $.fn.zTree.getZTreeObj(treeId);
	//所有节点
	var nodes = zTreeobj.getNodes();
	for (var i=0, l=nodes.length; i < l; i++) {
		//不影响 treeNode.nocheck = true即没有勾选框的节点
		zTreeobj.setChkDisabled(nodes[i], true, false, true);//3个boolean 表示是否禁用勾选/是否全部父节点进行同样的操作/是否全部子节点进行同样的操作
	}
}
//ztree勾选全部节点
function checkAllNodes(treeId) {
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
//	treeObj.checkAllNodes(true);
	//所有节点
	var nodes = treeObj.getNodes();
	for (var i=0, l=nodes.length; i < l; i++) {
		treeObj.checkNode(nodes[i], true, false, true);
	}
}
//ztree选中节点
function selectZtreeNode(treeId,value) {
	var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
	var node = zTreeObj.getNodeByParam("id",value);
	zTreeObj.selectNode(node,true); //true 是否追加选中
}
